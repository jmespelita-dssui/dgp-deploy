/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'

import { emptyTask, getLabelColor, getPratica, getUserTodo } from 'src/services/praticaService'

import Pratica from './Pratica'
import LoadingOverlay from '../modals/LoadingOverlay'
import { filterPratiche, getAccessLevel } from 'src/services/accessService'
import { useAccessRights } from 'src/hooks/useAccessRights'
import TaskList from './TaskList'
import PraticheList from './PraticheList'

const Home = ({ isArchive }) => {
  const [archiveList, setArchiveList] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectedPratica, setSelectedPratica] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [label, setLabel] = useState('')
  const [tab, setTab] = useState('')
  const [permittedPratiche, setPermittedPratiche] = useState([])
  const [todoList, setTodoList] = useState([])
  const { currentUser, assignedPratiche, loading: accessLoading } = useAccessRights()

  useEffect(() => {
    if (accessLoading) return

    loadTasks()
    loadPratiche()
  }, [currentUser, accessLoading, assignedPratiche, visible])

  const loadPratiche = async () => {
    await getAccessLevel()
    setLoading(true)
    try {
      filterPratiche(assignedPratiche, isArchive).then(({ archiveList, permittedPratiche }) => {
        setArchiveList(archiveList)
        setPermittedPratiche(permittedPratiche)
        setLoading(false)
      })
    } finally {
      setTab('')
      setLoading(false)
    }
  }
  const loadTasks = async () => {
    if (currentUser?.systemuserid) {
      await getUserTodo(currentUser?.systemuserid).then((response) => {
        setTodoList(response)
      })
    }
  }

  const columns = [
    { key: 'summary', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'open_folder', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'cr9b3_status', label: '', _style: { width: '10%' }, sorter: false },
    { key: 'cr9b3_protno', label: 'Prot' },
    {
      key: 'cr9b3_titolo',
      label: 'Titolo',
    },
    { key: 'cr9b3_categoria', label: 'Categoria' },
    // { key: 'dssui_primascadenza', label: 'Prima Scadenza' },
    {
      key: 'createdon',
      label: 'Creato',
      sorter: (date1, date2) => {
        const a = new Date(date1.registered)
        const b = new Date(date2.registered)
        return a > b ? 1 : b > a ? -1 : 0
      },
    },
  ]

  const openPratica = (item) => {
    setVisible(true)
    setLabel(getLabelColor(item.cr9b3_categoria).label)
    setSelectedPratica(item)
  }

  const onClosePratica = () => {
    console.log('Closing pratica, resetting selectedPratica to emptyTask')
    setSelectedPratica(emptyTask)
    setVisible(false)
    loadPratiche()
  }

  const setNewPratica = async (pratID, type) => {
    setLoadingOverlay(true)
    setVisible(false)
    const startTime = Date.now()
    try {
      const newPratica = await getPratica(pratID)
      setLabel(getLabelColor(newPratica.cr9b3_categoria))
      setSelectedPratica(newPratica)
      if (type) {
        setTab(type)
      }
    } catch {
      console.log('error opening related pratica')
    } finally {
      const elapsed = Date.now() - startTime
      const delay = Math.max(1500 - elapsed, 0)
      setTimeout(() => {
        setLoadingOverlay(false)
        setVisible(true)
      }, delay)
    }
  }

  return (
    <>
      <LoadingOverlay loading={loadingOverlay} />
      {!isArchive && <TaskList todoList={todoList} setNewPratica={setNewPratica} />}
      <Pratica
        visible={visible}
        onClose={onClosePratica}
        pratica={selectedPratica}
        permittedPratiche={permittedPratiche}
        label={label}
        setNewPratica={setNewPratica}
        tab={tab}
      />
      <PraticheList
        columns={columns}
        isArchive={isArchive}
        archiveList={archiveList}
        refreshKey={refreshKey}
        permittedPratiche={permittedPratiche}
        loading={loading}
        openPratica={openPratica}
      />
    </>
  )
}

export default Home
