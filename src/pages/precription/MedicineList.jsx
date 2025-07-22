import React from 'react';

const MedicineList = ({ data }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded-lg mt-4">
      <h2 className="text-xl font-bold text-gray-700 mb-3 text-center">
        Medicine Details
      </h2>
      <div className="space-y-2">
        {data.medicineName.map((medicine) => (
          <div key={medicine} className="mt-1 text-gray-600">
           <div className='flex gap-1 items-center'>
           <p className="text-md font-semibold text-[#0a2032]">
              {`${medicine.charAt(0).toUpperCase() + medicine.slice(1)}`}
            </p>
            <span className='text-xs font-thin text-[#0a2032]'>{`(${data?.doses?.[medicine]})`}</span>
           </div>
            <div className="mt-1 flex ml-19 text-md font-normal gap-1 ">
              <p className="">
                {`One Capsule at `} 
              </p>
              <span> {data?.doesTiming?.[medicine]?.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default MedicineList;
