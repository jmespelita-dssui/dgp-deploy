import axios from 'axios'
import { getAccessToken } from 'src/util/axiosUtils'

export const searchDataverse = async (query) => {
  const token = await getAccessToken()
  const response = await axios.post(
    'https://orgac85713a.crm4.dynamics.com/api/search/v1.0/query',
    {
      search: query,
      entities: [
        {
          name: 'cr9b3_pratica',
          //   searchColumns: [
          //     'cr9b3_corrispondenza',
          //     'cr9b3_debrief',
          //     'cr9b3_destinatari',
          //     'cr9b3_enteinviante',
          //     'cr9b3_entericevente',
          //     'cr9b3_indirizzidestinatari',
          //     'cr9b3_istruzionesuperiori',
          //     'cr9b3_luogoevento',
          //     'cr9b3_materiarapporto',
          //     'cr9b3_notes',
          //     'cr9b3_personarichiedente',
          //     'cr9b3_prano',
          //     'cr9b3_protno',
          //     'cr9b3_temacontributo',
          //     'cr9b3_titolo',
          //     'cr9b3_titoloevento',
          //   ],
        },
        // {
        //   name: 'cr9b3_employee',
        //   searchColumns: ['cr9b3_firstname', 'cr9b3_lastname'],
        // },
      ],
      top: 25,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
  console.log(response.data)
  return response.data
}
