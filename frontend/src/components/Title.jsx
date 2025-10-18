import React from 'react'

const Title = ({ title1, title2, titleStyles, title1Styles, paraStyles }) => {
  return (
    <div className={`${titleStyles} pb-1`}>
      <h2 className={`${title1Styles} h2`}>{title1}
        <span className='text-[#4169E1]  !font-light'> {title2}</span>
      </h2>
      <p className={`${paraStyles} hidden`}>Our gemstones are carefully selected and expertly crafted to showcase their natural beauty and exceptional quality. <br />
        Each gemstone is crafted to deliver exquisite beauty and lasting quality.</p>
    </div>
  )
}

export default Title