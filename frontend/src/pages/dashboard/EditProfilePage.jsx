import React from 'react';

const EditProfilePage = () => {
  const inputClass = "w-full bg-background border border-border rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent";
  const labelClass = "block text-text-secondary mb-2";

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2 text-text-primary">Edit Profile</h2>
      <p className="text-text-secondary mb-6">
        Users will update their avatar, region, and other demographic information here.
      </p>
      <div className="bg-card p-6 rounded-lg">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className={labelClass}>Username</label>
              <input type="text" id="username" className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input type="email" id="email" className={inputClass} />
            </div>
            <div>
              <label htmlFor="region" className={labelClass}>Region</label>
              <select id="region" className={inputClass}>
                <option>North America</option>
                <option>Europe</option>
                <option>Asia</option>
              </select>
            </div>
            <div>
              <label htmlFor="avatar" className={labelClass}>Avatar</label>
              <input type="file" id="avatar" className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover" />
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="bg-accent hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage; 