/* eslint-disable react/prop-types */
import { cilFlagAlt, cilFolder, cilMoodVeryGood } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CBadge, CListGroupItem } from '@coreui/react-pro'
import moment from 'moment'
import React, { useState } from 'react'
import { getLabelColor } from 'src/services/praticaService'
import Pratica from '../pratica/Pratica'
import LoadingOverlay from '../modals/LoadingOverlay'
import RequestAccess from '../modals/RequestAccess'
import { sendNotificationtoUser } from 'src/services/notificationService'
import { useToast } from 'src/context/ToastContext'
import ConfirmAccess from '../modals/ConfirmAccess'
import { checkAccessToPratica, getUser, giveAccess } from 'src/services/accessService'
import apiClient from 'src/util/apiClient'

const Notification = ({ notif, praticheList, permittedTasks, markNotifAsRead }) => {
  const [visible, setVisible] = useState(false)
  const [selectedPratica, setSelectedPratica] = useState(null)
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [visibleRequestAccess, setVisibleRequestAccess] = useState(false)
  const [visibleConfirmAccess, setVisibleConfirmAccess] = useState(false)
  const { addToast } = useToast()

  const setNewPratica = async (pratica) => {
    setLoading(true)
    const startTime = Date.now()
    try {
      setSelectedPratica(pratica)
      setLabel(getLabelColor(pratica.cr9b3_categoria))
    } catch (error) {
      console.error('error opening related pratica', error)
    } finally {
      const elapsed = Date.now() - startTime
      const delay = Math.max(1500 - elapsed, 0)
      setTimeout(() => {
        setLoading(false)
        setVisible(true)
      }, delay)
    }
  }

  const getBorderColor = (type) => {
    switch (type) {
      case 'completed':
        return 'success'
      case 'task':
        return 'danger'
      case 'request access':
        return 'danger'
      case 'pratica':
        return 'info'
      case 'status':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const verifyAccess = (pratica) => {
    if (praticheList) {
      return praticheList.find((p) => p.cr9b3_praticaid === pratica.cr9b3_praticaid)
    }
    return false
  }

  const onConfirmRequestAccess = async () => {
    // const systemuserid = await getSystemUserID(notif.)
    await sendNotificationtoUser(
      notif.pratica._createdby_value,
      'Richiesta di accesso',
      'request access',
      notif.pratica.cr9b3_praticaid,
    )
  }

  const setAccess = async (isGranted) => {
    setLoading(true)
    const user = await getUser(notif._createdby_value)
    const hasAccess = await checkAccessToPratica(
      notif.pratica.cr9b3_praticaid,
      user.azureactivedirectoryobjectid,
    )
    console.log(user.yomifullname, 'has access?:', hasAccess)
    console.log('what say you?', isGranted)

    const response = await giveAccess(notif._createdby_value, notif.pratica.cr9b3_praticaid)
    if (response) {
      await apiClient
        .patch(`cr9b3_notifications(${notif.cr9b3_notificationid})`, {
          cr9b3_comment: response ? 'access granted' : 'access denied',
          cr9b3_completed: true,
        })
        .then(() => {
          addToast('Risposta salvata.', 'Azione', 'success', 3000)
          setVisibleConfirmAccess(false)
          setLoading(false)
        })
    }
  }

  const handleClick = async () => {
    console.log(notif)
    const user = await getUser(notif._createdby_value)
    const hasAccess = await checkAccessToPratica(
      notif.pratica.cr9b3_praticaid,
      user.azureactivedirectoryobjectid,
    )
    console.log(
      user.yomifullname,
      user.azureactivedirectoryobjectid,
      'has access to pratica?',
      notif.pratica,
      hasAccess,
    )
    if (notif.cr9b3_type === 'request access') {
      if (hasAccess) {
        setVisibleConfirmAccess(false)
        addToast(
          `${user.yomifullname} ha già accesso alla pratica.`,
          'Azione già fatto',
          'success',
          3000,
        )
      } else if (notif.cr9b3_completed && notif.cr9b3_comment === 'access denied') {
        let msg = `Hai respinto la richiesta il ${moment(notif.createdon).format('DD/MM HH:mm')}.`
        addToast(msg, 'Azione già fatto', 'warning', 3000)
      } else {
        setVisibleConfirmAccess(true)
      }
    } else if (verifyAccess(notif.pratica)) {
      setNewPratica(notif.pratica)
    } else {
      setVisibleRequestAccess(true)
    }
    markNotifAsRead(notif)
  }

  return (
    <>
      <LoadingOverlay loading={loading} />
      <ConfirmAccess
        visible={visibleConfirmAccess}
        onCancel={() => setVisibleConfirmAccess(false)}
        onContinue={setAccess}
        notif={notif}
      />
      <RequestAccess
        visible={visibleRequestAccess}
        onClose={() => setVisibleRequestAccess(false)}
        onSubmit={onConfirmRequestAccess}
        pratica={notif.pratica}
      />
      <Pratica
        visible={visible}
        onClose={() => setVisible(false)}
        pratica={selectedPratica}
        praticheList={praticheList}
        permittedTasks={permittedTasks}
        label={label}
        setNewPratica={setNewPratica}
      />
      <CListGroupItem
        className={`border-start-4 border-start-${getBorderColor(
          notif.cr9b3_type,
        )} position-relative`}
        onClick={() => handleClick()}
        style={{ cursor: 'pointer' }}
      >
        <div>
          {notif.cr9b3_type === 'completed' ? (
            <>
              <div className="position-relative">
                <CIcon icon={cilMoodVeryGood} className="me-2" />
                Pratica <strong>{notif.pratica.cr9b3_protno}</strong> è stata completata.
                {notif.cr9b3_read ? null : (
                  <CBadge
                    className="border border-light position-absolute top-0 start-100 translate-middle p-1 mt-1"
                    color="info"
                    position="top-end"
                    shape="rounded-circle"
                  >
                    <span className="visually-hidden">New alerts</span>
                  </CBadge>
                )}
              </div>
              <div>
                <small className="text-medium-emphasis me-3">
                  da <strong>{notif.cr9b3_actor}</strong>
                </small>
                <small className="float-end text-medium-emphasis">
                  {moment(notif.createdon).format('DD/MM HH:mm')}
                </small>
              </div>
            </>
          ) : notif.cr9b3_type === 'status' ? (
            <>
              <div className="position-relative">
                <CIcon icon={cilFolder} className="me-2" />
                Stato pratica{' '}
                <strong>
                  {notif.pratica.cr9b3_protno}: {notif.cr9b3_description}
                </strong>
                .
                {notif.cr9b3_read ? null : (
                  <CBadge
                    className="border border-light position-absolute top-0 start-100 translate-middle p-1 mt-1"
                    color="info"
                    position="top-end"
                    shape="rounded-circle"
                  >
                    <span className="visually-hidden">New alerts</span>
                  </CBadge>
                )}
              </div>
              <div>
                <small className="text-medium-emphasis me-3">
                  da <strong>{notif.cr9b3_actor}</strong>
                </small>
                <small className="float-end text-medium-emphasis">
                  {moment(notif.createdon).format('DD/MM HH:mm')}
                </small>
              </div>
            </>
          ) : notif.cr9b3_type === 'request access' ? (
            <>
              <div className="position-relative">
                <CIcon icon={cilFolder} className="me-2" />
                {notif.cr9b3_actor} richiede accesso alla pratica{' '}
                <strong>{notif.pratica.cr9b3_protno}</strong> - {notif.pratica.cr9b3_titolo}.
                {notif.cr9b3_read ? null : (
                  <CBadge
                    className="border border-light position-absolute top-0 start-100 translate-middle p-1 mt-1"
                    color="info"
                    position="top-end"
                    shape="rounded-circle"
                  >
                    <span className="visually-hidden">New alerts</span>
                  </CBadge>
                )}
              </div>
              <div>
                <small className="float-end text-medium-emphasis">
                  {moment(notif.createdon).format('DD/MM HH:mm')}
                </small>
              </div>
            </>
          ) : (
            <div className="position-relative">
              <CIcon icon={notif.cr9b3_type === 'task' ? cilFlagAlt : cilFolder} className="me-2" />
              <strong>{notif.cr9b3_actor}</strong> {notif.cr9b3_description}
              {notif.cr9b3_read ? null : (
                <CBadge
                  className="border border-light position-absolute top-0 start-100 translate-middle p-1 mt-1"
                  color="info"
                  position="top-end"
                  shape="rounded-circle"
                >
                  <span className="visually-hidden">New alerts</span>
                </CBadge>
              )}
              <small className="text-medium-emphasis me-3">
                <br />
                <strong>{notif.pratica.cr9b3_protno}</strong> {notif.pratica.cr9b3_titolo}
              </small>
              <small className="float-end text-medium-emphasis">
                {moment(notif.createdon).format('DD/MM HH:mm')}
              </small>
            </div>
          )}
        </div>
      </CListGroupItem>
    </>
  )
}

export default Notification
