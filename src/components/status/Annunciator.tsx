import React from 'react'

const Annunciator = (status: string) => {
  return (
    <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        
          <div
            className={`status-annunciator ${status}`}
          >
            <span className="status-text">
              Fail
            </span>
          </div>
      </div>
  )
}

export default Annunciator