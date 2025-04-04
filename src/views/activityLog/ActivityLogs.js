/* eslint-disable react/prop-types */
import { CContainer, CLink, CListGroup, CListGroupItem } from '@coreui/react-pro'
import moment from 'moment'
import React, { useEffect } from 'react'

const ActivityLogs = ({ activityLogs }) => {
  return (
    <>
      <CContainer>
        <h6>ACTIVITY LOG</h6>
        <CListGroup className="mb-3" flush>
          {activityLogs &&
            activityLogs.map((activity, index) => (
              <CListGroupItem key={index}>
                {moment(activity.timestamp).format('DD/MM/YYYY HH:mm')}:{' '}
                <span className="fst-italic">{activity.user} </span>
                {activity.actionType}
                {activity.actions && (
                  <ul>
                    {activity.actions.map((action, value) =>
                      action.title === 'Links' ? (
                        JSON.parse(action.input).map((link, index) => (
                          <li key={index}>
                            {link.action === 'add'
                              ? 'Added link: '
                              : link.action === 'edit'
                              ? 'Edited link: '
                              : 'Deleted link: '}
                            <CLink href={link.url} target="_blank">
                              {link.label}
                            </CLink>
                          </li>
                        ))
                      ) : (
                        <li key={value}>
                          <span className="text-decoration-underline">{action.title}</span>:{' '}
                          {!action.title.includes('Data')
                            ? action.input
                            : moment(action.input).format('DD/MM/YYYY')}
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </CListGroupItem>
            ))}
        </CListGroup>
      </CContainer>
    </>
  )
}

export default ActivityLogs
