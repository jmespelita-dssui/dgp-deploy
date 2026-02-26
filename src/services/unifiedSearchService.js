// src/services/unifiedSearch.js
import React from 'react'
import apiClient from 'src/util/apiClient'

// Escape regex safely
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Highlight helper
export function highlightMatch(text, query) {
  if (!text || !query) return text

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, index) => (regex.test(part) ? <strong key={index}>{part}</strong> : part))
}

export async function unifiedSearch(query, permittedPratiche) {
  console.log(
    'Running unified search for query:',
    query,
    'with permittedPratiche:',
    permittedPratiche,
  )
  if (!query) return []

  const baseUrl = 'https://orgac85713a.crm4.dynamics.com/api/data/v9.2'

  const praticaColumns = [
    'cr9b3_corrispondenza',
    'cr9b3_debrief',
    'cr9b3_destinatari',
    'cr9b3_enteinviante',
    'cr9b3_entericevente',
    'cr9b3_indirizzidestinatari',
    'cr9b3_istruzionesuperiori',
    'cr9b3_luogoevento',
    'cr9b3_materiarapporto',
    'cr9b3_notes',
    'cr9b3_personarichiedente',
    'cr9b3_prano',
    'cr9b3_protno',
    'cr9b3_temacontributo',
    'cr9b3_titolo',
    'cr9b3_titoloevento',
  ]

  // Build OData filter for Pratica
  const praticaFilter = praticaColumns.map((col) => `contains(${col},'${query}')`).join(' or ')

  const praticaUrl = `${baseUrl}/cr9b3_praticas?$filter=${praticaFilter}`

  // Build OData URL for Correspondences with expand to parent Pratica
  const correspondenceFilter = `contains(cr9b3_type,'${query}') or contains(cr9b3_message,'${query}')`
  const correspondenceUrl = `${baseUrl}/cr9b3_correspondences?$select=cr9b3_correspondenceid,cr9b3_type,cr9b3_message,cr9b3_date,_cr9b3_pratica_value&$expand=cr9b3_Pratica&$filter=${correspondenceFilter}`

  try {
    const [praticaRes, corrRes] = await Promise.all([
      apiClient.get(praticaUrl),
      apiClient.get(correspondenceUrl),
    ])

    const resultMap = new Map()
    const filteredIDs = new Set(permittedPratiche.map((item) => item.cr9b3_praticaid))
    // console.log(praticaRes, corrRes)
    const filteredPraticaRes = praticaRes.data.value.filter((item) =>
      filteredIDs.has(item.cr9b3_praticaid),
    )
    const filteredCorrRes = corrRes.data.value.filter((item) =>
      filteredIDs.has(item.cr9b3_Pratica.cr9b3_praticaid),
    )
    // ---- Process Pratica Matches ----
    filteredPraticaRes.forEach((record) => {
      praticaColumns.forEach((col) => {
        if (record[col] && record[col].toLowerCase().includes(query.toLowerCase())) {
          const id = record.cr9b3_praticaid
          if (!resultMap.has(id)) {
            resultMap.set(id, { pratica: record, matches: [] })
          }
          resultMap.get(id).matches.push({
            type: 'pratica',
            column: col,
            text: record[col],
          })
        }
      })
    })

    // ---- Process Correspondence Matches ----
    filteredCorrRes.forEach((corr) => {
      const parent = corr.cr9b3_Pratica
      if (!parent) return

      const id = parent.cr9b3_praticaid
      if (!resultMap.has(id)) {
        resultMap.set(id, { pratica: parent, matches: [] })
      }

      if (corr.cr9b3_type && corr.cr9b3_type.toLowerCase().includes(query.toLowerCase())) {
        resultMap.get(id).matches.push({
          type: 'correspondence',
          column: 'cr9b3_type',
          text: corr.cr9b3_type,
          relatedId: corr.cr9b3_correspondenceid,
        })
      }

      if (corr.cr9b3_message && corr.cr9b3_message.toLowerCase().includes(query.toLowerCase())) {
        resultMap.get(id).matches.push({
          type: 'correspondence',
          column: 'cr9b3_message',
          text: corr.cr9b3_message,
          relatedId: corr.cr9b3_correspondenceid,
        })
      }
    })

    console.log('Unified search results:', Array.from(resultMap.values()))

    return Array.from(resultMap.values())
  } catch (error) {
    console.error('Unified search error:', error)
    return []
  }
}
