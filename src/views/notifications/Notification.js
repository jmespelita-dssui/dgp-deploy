/* eslint-disable react/prop-types */
import { cilFlagAlt, cilFolder, cilMoodVeryGood } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CListGroupItem } from '@coreui/react-pro'
import moment from 'moment'
import React from 'react'
// import Pratica from '../pratiche/Pratica'

const Notification = ({ notif, index }) => {
  const getBorderColor = (type) => {
    switch (type) {
      case 'completed':
        return 'success'
      case 'task':
        return 'warning'
      case 'pratica':
        return 'info'
      default:
        return 'secondary'
    }
  }
  return (
    <>
      {/* <Pratica /> */}
      <CListGroupItem
        key={index}
        className={`border-start-4 border-start-${getBorderColor(notif.cr9b3_type)}`}
      >
        <div>
          {notif.cr9b3_type === 'completed' ? (
            <>
              <div>
                <CIcon icon={cilMoodVeryGood} className="me-2" />
                Pratica <strong>{notif.pratica.cr9b3_protno}</strong> è stata completata.
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
          ) : (
            <>
              <CIcon icon={notif.cr9b3_type === 'task' ? cilFlagAlt : cilFolder} className="me-2" />
              <strong>{notif.cr9b3_actor}</strong> {notif.cr9b3_description}
              <small className="text-medium-emphasis me-3">
                <br />
                <strong>{notif.pratica.cr9b3_protno}</strong> {notif.pratica.cr9b3_titolo}
              </small>
              <small className="float-end text-medium-emphasis">
                {moment(notif.createdon).format('DD/MM HH:mm')}
              </small>
            </>
          )}
        </div>
      </CListGroupItem>
    </>
  )
}

export default Notification
