/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'

import { getFields } from 'src/util/taskUtils'

import { CInputGroup, CInputGroupText, CFormInput, CContainer } from '@coreui/react-pro'
import { People, Person } from '@microsoft/mgt-react'

const Fields = ({ pratica, superioriInvitati }) => {
  const [isView, setIsEdit] = useState(true)
  const [fields, setFields] = useState({})
  const [superioriInvitatiList, setSuperioriInvitatiList] = useState([])

  useEffect(() => {
    setFields(getFields(pratica.cr9b3_categoria))
    setSuperioriInvitatiList(superioriInvitati)
    // console.log('should show graph objects', superioriInvitati)
  }, [superioriInvitati])

  return (
    <>
      <CContainer className="mb-5">
        <CInputGroup className="mb-3 mt-4">
          <CInputGroupText id="data-timbro-superiore">Data timbro superiore:</CInputGroupText>
          <CFormInput
            defaultValue={
              pratica.cr9b3_datatimbrosuperiore &&
              moment(pratica.cr9b3_datatimbrosuperiore).format('DD/MM/YYYY')
            }
            readOnly={isView}
          />
        </CInputGroup>
        {fields.data_prima_scadenza && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="data-prima-scadenza">Data prima scadenza:</CInputGroupText>
            <CFormInput
              defaultValue={
                pratica.cr9b3_primascadenza &&
                moment(pratica.cr9b3_primascadenza).format('DD/MM/YYYY')
              }
              readOnly={isView}
            />
          </CInputGroup>
        )}

        {fields.data_invio_materiale && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="data-invio-materiale">
              Scadenza invio del materiale:
            </CInputGroupText>
            <CFormInput
              defaultValue={
                pratica.cr9b3_datainviomateriale &&
                moment(pratica.cr9b3_datainviomateriale).format('DD/MM/YYYY')
              }
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.data_richiesta_contributo && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="data-richiesta-contributo">
              Scadenza richiesta contributo:
            </CInputGroupText>
            <CFormInput
              defaultValue={
                pratica.cr9b3_datarichiestacontributo &&
                moment(pratica.cr9b3_datarichiestacontributo).format('DD/MM/YYYY')
              }
              readOnly={isView}
            />
          </CInputGroup>
        )}
      </CContainer>
      <CContainer className="mb-5">
        {fields.ente_inviante && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="ente-inviante">Ente inviante:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_enteinviante}
              aria-label="Ente inviante"
              aria-describedby="ente-inviante"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.ente_richiedente && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="ente-richiedente">Ente richiedente:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_enterichiedente}
              aria-label="Ente richiedente"
              aria-describedby="ente-richiedente"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.ente_ricevente && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="ente-ricevente">Ente ricevente:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_entericevente}
              aria-label="Ente ricevente"
              aria-describedby="ente-ricevente"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.persona_richiedente && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="ente-richiedente">Persona richiedente:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_personarichiedente}
              aria-label="Persona richiedente"
              aria-describedby="persona-richiedente"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.destinatari && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="destinatari">Destinatari:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_destinatari}
              aria-label="Destinatari"
              aria-describedby="destinatari"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.indirizzi_destinatari && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="indirizzi-destinatari">Indirizzi destinatari:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_indirizzidestinatari}
              aria-label="Indirizzi estinatari"
              aria-describedby="indirizzi-destinatari"
              readOnly={isView}
            />
          </CInputGroup>
        )}
      </CContainer>
      <CContainer className="mb-5">
        {fields.data_evento && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="data-evento">Data evento:</CInputGroupText>
            <CFormInput
              defaultValue={
                pratica.cr9b3_dataevento &&
                moment(pratica.cr9b3_dataevento).format('DD/MM/YYYY HH:mm')
              }
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.titolo_evento && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="titolo-evento">Titolo evento:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_titoloevento}
              aria-label="Titolo evento"
              aria-describedby="titolo-evento"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.luogo_evento && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="luogo-evento">Luogo evento:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_titoloevento}
              aria-label="Luogo evento"
              aria-describedby="luogo-evento"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.tema_contributo && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="tema-contributo">Tema del contributo:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_temacontributo}
              aria-label="Tema del contributo"
              aria-describedby="tema-contributo"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.materia_contributo && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="materia-contributo">Materia del contributo:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_materiacontributo}
              aria-label="Materia del contributo"
              aria-describedby="materia-contributo"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.no_partecipanti && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="no-partecipanti">No. partecipanti:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_nopartecipanti}
              aria-label="No. partecipanti"
              aria-describedby="no-partecipanti"
              readOnly={isView}
            />
          </CInputGroup>
        )}
      </CContainer>
      <CContainer className="mb-5">
        <CInputGroup className="mb-3">
          <CInputGroupText id="sezione-responsabile">Sezione Responsabile:</CInputGroupText>
          <CFormInput
            defaultValue={pratica.cr9b3_sezioneresponsabile}
            aria-label="Sezione Responsabile"
            aria-describedby="sezione-responsabile"
            readOnly={isView}
          />
        </CInputGroup>
        <CInputGroup className="mb-3">
          <CInputGroupText id="data-inoltrata">Data inoltrato al responsabile:</CInputGroupText>
          <CFormInput
            defaultValue={
              pratica.cr9b3_datainoltrataresponsabile &&
              moment(pratica.cr9b3_datainoltrataresponsabile).format('DD/MM/YYYY')
            }
            readOnly={isView}
          />
        </CInputGroup>
        {fields.superiori_invitati && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="superiori-invitati">Superiori invitati:</CInputGroupText>
            {/* <CFormInput
              defaultValue={superioriInvitatiList}
              aria-label="Superiori invitati"
              aria-describedby="superiori-invitati"
              readOnly={isView}f
            /> */}
            {superioriInvitatiList.map((s, index) => (
              <p key={s.id} className="m-2">
                {index > 0 && ','} {/* Show comma before each name except the first */}
                {/* <Person
                  key={s.id}
                  personQuery={s.mail}
                  personCardInteraction="hover"
                  showPresence={false} // Optional: show presence status
                  showEmail={false} // Optional: show email
                  showJobTitle={false} // Optional: show job title
                  showDisplayName={true} // Ensure display name is shown
                /> */}
                {s.displayName} {/* Display the user's name */}
              </p>
            ))}
            {/* {superioriInvitatiList.map((s) => (
              <>
                <Person
                  key={s.id}
                  personQuery={s.mail}
                  personCardInteraction="hover"
                  showPresence={false} // Optional: show presence status
                  showEmail={false} // Optional: show email
                  showJobTitle={false} // Optional: show job title
                  showDisplayName={true} // Ensure display name is shown
                />
              </>
            ))} */}
            {/* <People people={superioriInvitatiList} showPresence={true} showDisplayName={true}/> */}
          </CInputGroup>
        )}
        <CInputGroup className="mb-3">
          <CInputGroupText id="officiale-incaricato">Officiale incaricato:</CInputGroupText>
          <CFormInput
            defaultValue={pratica.cr9b3_officialeincaricato}
            aria-label="Officiale incaricato"
            aria-describedby="officiale-incaricato"
            readOnly={isView}
          />
        </CInputGroup>

        {fields.dssui_partecipanti && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="dssui-partecipanti">Nome dei partecipanti DSSUI:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_dssuipartecipanti}
              aria-label="Nome partecipanti DSSUI"
              aria-describedby="dssui-partecipanti"
              readOnly={isView}
            />
          </CInputGroup>
        )}
      </CContainer>
      <CContainer className="mb-5">
        {fields.paese && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="paese">Paese:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_paese}
              aria-label="Paese"
              aria-describedby="paese"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.regione && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="regione">Regione:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_regione}
              aria-label="Regione"
              aria-describedby="regione"
              readOnly={isView}
            />
          </CInputGroup>
        )}
        {fields.citta && (
          <CInputGroup className="mb-3">
            <CInputGroupText id="citta">Città:</CInputGroupText>
            <CFormInput
              defaultValue={pratica.cr9b3_regione}
              aria-label="Città"
              aria-describedby="citta"
              readOnly={isView}
            />
          </CInputGroup>
        )}
      </CContainer>
    </>
  )
}

export default Fields
