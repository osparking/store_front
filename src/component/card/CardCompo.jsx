import React from 'react'

const CardCompo = ({ label }) => {
    return (
        <div className="admin-card">
            <div className="card-inner">{label}</div>
        </div>
    )
}

export default CardCompo