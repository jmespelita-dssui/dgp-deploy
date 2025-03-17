import { CToast, CToastBody, CToastHeader } from '@coreui/react-pro'
import { createAxiosInstance, getAccessToken } from './axiosUtils'
import React from 'react'
import { getAccessTokenForGraph } from './axiosUtils'

export const emptyTask = {
  cr9b3_prano: '',
  cr9b3_protno: '',
  cr9b3_protno2: '',
  cr9b3_titolo: '',
  cr9b3_status: 0,
  cr9b3_categoria: '',
  cr9b3_datainviomateriale: '',
  cr9b3_primascadenza: '',
  cr9b3_istruzionesuperiori: '',
  cr9b3_datatimbrosuperiore: '',
  cr9b3_datarichiestacontributo: '',
  cr9b3_datainoltrataresponsabile: '',
  cr9b3_enteinviante: '',
  cr9b3_enterichiedente: '',
  cr9b3_entericevente: '',
  cr9b3_personarichiedente: '',
  cr9b3_dssuiorganizzatore: '',
  cr9b3_destinatari: '',
  cr9b3_indirizzidestinatari: '',
  cr9b3_dataevento: '',
  cr9b3_titoloevento: '',
  cr9b3_luogoevento: '',
  cr9b3_temacontributo: '',
  cr9b3_materiarapporto: '',
  cr9b3_superioriinvitati: '',
  cr9b3_sezioneresponsabile: '',
  cr9b3_nopartecipanti: '',
  cr9b3_dssuipartecipanti: '',
  cr9b3_paese: '',
  cr9b3_regione: '',
  cr9b3_citta: '',
  cr9b3_sharepointlink: '',
  cr9b3_corrispondenza: '',
  cr9b3_notes: '',
}

export const getFields = (categoria) => {
  let fields = {}
  let template = {
    data_invio_materiale: false,
    data_prima_scadenza: false,
    data_richiesta_contributo: false,
    ente_inviante: false,
    ente_richiedente: false,
    ente_ricevente: false,
    persona_richiedente: false,
    dssui_organizzatore: false,
    destinatari: false,
    indirizzi_destinatari: false,
    data_evento: false,
    titolo_evento: false,
    luogo_evento: false,
    tema_contributo: false,
    materia_contributo: false,
    materia_rapporto: false,
    superiori_invitati: false,
    no_partecipanti: false,
    dssui_partecipanti: false,
    paese: false,
    regione: false,
    citta: false,
    correspondence: false,
  }

  switch (categoria) {
    case 12958: //testing
      fields = {
        data_invio_materiale: true,
        data_prima_scadenza: true,
        data_richiesta_contributo: true,
        ente_inviante: true,
        ente_richiedente: true,
        ente_ricevente: true,
        persona_richiedente: true,
        dssui_organizzatore: true,
        destinatari: true,
        indirizzi_destinatari: true,
        data_evento: true,
        titolo_evento: true,
        luogo_evento: true,
        tema_contributo: true,
        materia_contributo: true,
        materia_rapporto: true,
        superiori_invitati: true,
        no_partecipanti: true,
        dssui_partecipanti: true,
        paese: true,
        regione: true,
        citta: true,
        correspondence: true,
      }
      break
    case 129580000: //RICHIESTA CONTRIBUTO
      fields = {
        ...template,
        category: '129580000 RICHIESTA CONTRIBUTO',
        label: 'RICHIESTA CONTRIBUTO - articolo/messaggio',
        data_richiesta_contributo: true,
        ente_richiedente: true,
        tema_contributo: true,
      }
      break
    case 129580001: //PROGETTO ESTERNO
      fields = {
        ...template,
        category: '129580001 PROGETTO ESTERNO',
        label: 'PROGETTO ESTERNO',
        ente_inviante: true,
        paese: true,
        regione: true,
        citta: true,
      }
      break
    case 129580002: //EVENTO
      fields = {
        ...template,
        category: '129580002 EVENTO',
        label: 'EVENTO - viaggio estero/italia/roma',
        data_prima_scadenza: true,
        ente_richiedente: true,
        persona_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        superiori_invitati: true,
      }
      break
    case 129580003: //RICEZIONE RAPPORTI
      fields = {
        ...template,
        category: '129580003 RICEZIONE RAPPORTI',
        label: 'RICEZIONE DI RAPPORTI - partners, perm miss, Ap. N.',
        ente_inviante: true,
        materia_rapporto: true,
      }
      break
    case 129580004: //VISITA
      fields = {
        ...template,
        category: '129580004 VISITA',
        label: 'VISITA - ogni tipo di partner',
        ente_richiedente: true,
        persona_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        superiori_invitati: true,
        no_partecipanti: true,
      }
      break
    case 129580005: //SENZA RICHIESTA - EVENTO
      fields = {
        ...template,
        category: '129580005 SENZA RICHIESTA - EVENTO',
        label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invito evento)',
        dssui_organizzatore: true,
        titolo_evento: true,
        dssui_partecipanti: true,
      }
      break
    case 129580006: //SENZA RICHIESTA - LETTERA
      fields = {
        ...template,
        category: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invio lettera)',
        label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invio lettera)',
        ente_ricevente: true,
      }
      break
    case 129580007: //PURTROPPO
      fields = {
        ...template,
        category: '129580007 PURTROPPO',
        label: 'PURTROPPO - richiesta evento/contributo/altro',
        ente_richiedente: true,
        persona_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        superiori_invitati: true,
      }
      break
    case 129580008: //GENERICO
      fields = {
        ...template,
        category: '129580008 GENERICO',
        label: 'RAPPORTI/DOCUMENTI/INVITI GENERICI - partners, newsletters',
        data_invio_materiale: true,
        destinatari: true,
        indirizzi_destinatari: true,
        materia_contributo: true,
      }
      break
    case 129580009: //MESSAGGI PONTIFICI
      fields = {
        ...template,
        category: '129580009 MESSAGGI PONTIFICI',
        label: 'MESSAGGI PONTIFICI',
      }
      break
    case 129580010: //RICHIESTA CONTRIBUTO (NP)
      fields = {
        ...template,
        category: '129580010 RICHIESTA CONTRIBUTO (NP)',
        label: 'RICHIESTA CONTRIBUTO (NP)',
        ente_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        luogo_evento: true,
        superiori_invitati: true,
      }
      break
    default:
    // color = 'black'
  }
  return fields
}

export const getUserGraphDetails = async (userID) => {
  try {
    const token = await getAccessTokenForGraph()
    const axiosInstance = createAxiosInstance(token)

    // Fetch user details using systemuserid
    const response = await axiosInstance.get(`https://graph.microsoft.com/v1.0/users/${userID}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user details:', error)
    return null
  }
}

export const getSystemUserID = async (user) => {
  const token = await getAccessToken()
  const axiosInstance = createAxiosInstance(token)
  let userID
  try {
    // console.log('getting user id', user)
    const response = await axiosInstance.get(
      `systemusers?$filter=azureactivedirectoryobjectid eq '${user.id}'`,
    )
    // console.log(
    //   'user id',
    //   response.data.value[0],
    //   response.data.value[0].yomifullname,
    //   response.data.value[0].systemuserid,
    // )
    userID = response.data.value[0].systemuserid
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting user ID:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
  return userID
}

export const getCorrs = async (pratica) => {
  const token = await getAccessToken()
  const axiosInstance = createAxiosInstance(token)
  try {
    const response = await axiosInstance.get(
      `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_Pratica_Correspondence?$orderby=createdon desc`,
    )
    return response.data.value
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting correspondences:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}

export const successCreateTaskToast = (
  <CToast>
    <CToastHeader closeButton>
      <svg
        className="rounded me-2"
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        role="img"
      >
        <rect width="100%" height="100%" fill="#198754"></rect>
      </svg>
      <div className="fw-bold me-auto">Create Pratica</div>
      {/* <small>7 min ago</small> */}
    </CToastHeader>
    <CToastBody>Task successfully created!</CToastBody>
  </CToast>
)

export const assignUserToTask = async (userID, praticaID, table) => {
  const token = await getAccessToken()
  const axiosInstance = createAxiosInstance(token)
  // console.log('adding superiori invitati', userID)
  const data = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
  }
  try {
    // POST request to create a relationship in cr9b3_pratica_superiore
    const response = await axiosInstance.post(
      `systemusers(${userID})/${table}/$ref`, //cr9b3_pratica_superiore
      data,
    )
    console.log('Successfully created the user <-> pratica record:', response.data)
    return true
  } catch (error) {
    console.error(
      'Error creating user <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const getPratica = async (praticaID) => {
  const token = await getAccessToken()
  const axiosInstance = createAxiosInstance(token)
  const response = await axiosInstance.get(
    `cr9b3_praticas?$filter=cr9b3_praticaid eq '${praticaID}'`,
  )
  return response.data.value[0]
  // ?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}
}
{
  /* <CCard className="m-3">
                    <CCardHeader>2/11/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Met in person with richiedente, confirmed that the date of the event will be
                        on the 22nd of november.
                      </p>
                    </CCardBody>
                  </CCard>
                  <CCard className="m-3">
                    <CCardHeader>24/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Subject: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa Sede
                      </p>
                      <p>
                        Gentile Segreteria dell’Ambasciata presso la Santa Sede, mi chiamo Luca
                        Bianchi e rappresento l’organizzazione ItaliCult. Sarei molto onorato di
                        poter organizzare un incontro con S.E. l’Ambasciatore presso la Santa Sede
                        per discutere di alcune iniziative culturali in collaborazione con la vostra
                        ambasciata.
                      </p>
                      <p>
                        Potrei sapere se ci sono disponibilità nei prossimi giorni per un breve
                        incontro? Resto a disposizione per eventuali dettagli e preferenze di orario
                        e luogo da parte di Sua Eccellenza.
                      </p>
                      <p>
                        In attesa di un vostro gentile riscontro, vi ringrazio anticipatamente e
                        porgo i miei più cordiali saluti.
                      </p>
                      <p>Luca Bianchi</p>
                      <p>ItaliCult</p>
                      <p>Tel.: +39 333 1234567</p>
                      <p>Email: luca.bianchi@email.com</p>
                    </CCardBody>
                  </CCard>
                  <CCard className="m-3">
                    <CCardHeader>12/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Oggetto: RE: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa
                        Sede
                      </p>

                      <p>Gentile Sig. Bianchi,</p>

                      <p>
                        La ringraziamo per il suo messaggio e per l’interesse a collaborare con la
                        nostra Ambasciata. S.E. l’Ambasciatore sarebbe lieto di incontrarla e
                        discutere delle iniziative culturali di ItaliCult.
                      </p>

                      <p>
                        Saremmo disponibili per un incontro il 25 novembre alle ore 10:00, presso la
                        nostra sede in via XX Settembre 50. La preghiamo di confermare la sua
                        disponibilità o di suggerire un’altra data e orario qualora non le fosse
                        possibile partecipare in questa data.
                      </p>

                      <p>Restiamo in attesa di una sua cortese risposta.</p>

                      <p>Cordiali saluti,</p>
                      <p>Dott.ssa Maria Rossi</p>
                      <p>Segreteria dell’Ambasciata presso la Santa Sede</p>
                    </CCardBody>
                  </CCard>
                  <CCard className="m-3">
                    <CCardHeader>12/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Oggetto: RE: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa
                        Sede
                      </p>

                      <p>Gentile Sig. Bianchi,</p>

                      <p>
                        La ringraziamo per il suo messaggio e per l’interesse a collaborare con la
                        nostra Ambasciata. S.E. l’Ambasciatore sarebbe lieto di incontrarla e
                        discutere delle iniziative culturali di ItaliCult.
                      </p>

                      <p>
                        Saremmo disponibili per un incontro il 25 novembre alle ore 10:00, presso la
                        nostra sede in via XX Settembre 50. La preghiamo di confermare la sua
                        disponibilità o di suggerire un’altra data e orario qualora non le fosse
                        possibile partecipare in questa data.
                      </p>

                      <p>Restiamo in attesa di una sua cortese risposta.</p>

                      <p>Cordiali saluti,</p>
                      <p>Dott.ssa Maria Rossi</p>
                      <p>Segreteria dell’Ambasciata presso la Santa Sede</p>
                    </CCardBody>
                  </CCard>
                  <CCard className="m-3">
                    <CCardHeader>12/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Oggetto: RE: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa
                        Sede
                      </p>

                      <p>Gentile Sig. Bianchi,</p>

                      <p>
                        La ringraziamo per il suo messaggio e per l’interesse a collaborare con la
                        nostra Ambasciata. S.E. l’Ambasciatore sarebbe lieto di incontrarla e
                        discutere delle iniziative culturali di ItaliCult.
                      </p>

                      <p>
                        Saremmo disponibili per un incontro il 25 novembre alle ore 10:00, presso la
                        nostra sede in via XX Settembre 50. La preghiamo di confermare la sua
                        disponibilità o di suggerire un’altra data e orario qualora non le fosse
                        possibile partecipare in questa data.
                      </p>

                      <p>Restiamo in attesa di una sua cortese risposta.</p>

                      <p>Cordiali saluti,</p>
                      <p>Dott.ssa Maria Rossi</p>
                      <p>Segreteria dell’Ambasciata presso la Santa Sede</p>
                    </CCardBody>
                  </CCard> */
}

{
  /* <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                    </CListGroup> */
}
