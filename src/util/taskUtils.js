import { CToast, CToastBody, CToastHeader } from '@coreui/react-pro'
import { createAxiosInstance, getAccessToken } from './axiosUtils'
import React from 'react'
import { getAccessTokenForGraph } from './axiosUtils'

export const emptyTask = {
  cr9b3_prano: null,
  cr9b3_protno: null,
  cr9b3_titolo: null,
  cr9b3_status: 0,
  cr9b3_categoria: null,
  cr9b3_datainviomateriale: null,
  cr9b3_primascadenza: null,
  cr9b3_istruzionesuperiori: null,
  cr9b3_istruzioneda: null,
  cr9b3_datatimbrosuperiore: null,
  cr9b3_datarichiestacontributo: null,
  cr9b3_datainoltrataresponsabile: null,
  cr9b3_enteinviante: null,
  cr9b3_enterichiedente: null,
  cr9b3_entericevente: null,
  cr9b3_personarichiedente: null,
  cr9b3_dssuiorganizzatore: null,
  cr9b3_destinatari: null,
  cr9b3_indirizzidestinatari: null,
  cr9b3_dataevento: null,
  cr9b3_titoloevento: null,
  cr9b3_luogoevento: null,
  cr9b3_temacontributo: null,
  cr9b3_materiarapporto: null,
  cr9b3_superioriinvitati: null,
  cr9b3_sezioneresponsabile: null,
  cr9b3_nopartecipanti: null,
  cr9b3_dssuipartecipanti: null,
  cr9b3_paese: null,
  cr9b3_regione: null,
  cr9b3_citta: null,
  cr9b3_sharepointlink: null,
  cr9b3_corrispondenza: null,
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
        data_richiesta_contributo: true,
        ente_richiedente: true,
        tema_contributo: true,
      }
      break
    case 129580001: //PROGETTO ESTERNO
      fields = {
        ...template,
        ente_inviante: true,
        paese: true,
        regione: true,
        citta: true,
      }
      break
    case 129580002: //EVENTO
      fields = {
        ...template,
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
        ente_inviante: true,
        materia_rapporto: true,
      }
      break
    case 129580004: //VISITA
      fields = {
        ...template,
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
        dssui_organizzatore: true,
        titolo_evento: true,
        dssui_partecipanti: true,
      }
      break
    case 129580006: //SENZA RICHIESTA - LETTERA
      fields = {
        ...template,
        ente_ricevente: true,
      }
      break
    case 129580007: //PURTROPPO
      fields = {
        ...template,
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
        data_invio_materiale: true,
        destinatari: true,
        indirizzi_destinatari: true,
        materia_contributo: true,
      }
      break
    case 129580009: //MESSAGGI PONTIFICI
      fields = {
        ...template,
      }
      break
    case 129580010: //RICHIESTA CONTRIBUTO (NP)
      fields = {
        ...template,
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
    console.log('graph data for', userID, response.data)
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
    console.log('getting user id', user.id)
    const response = await axiosInstance.get(
      `systemusers?$filter=azureactivedirectoryobjectid eq '${user.id}'`,
    )
    console.log(
      'user id',
      response.data.value[0],
      response.data.value[0].yomifullname,
      response.data.value[0].systemuserid,
    )
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
