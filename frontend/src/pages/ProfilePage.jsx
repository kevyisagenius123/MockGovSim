import React from 'react';

const ProfilePage = () => {
    return (
        <div className="bg-card border border-border rounded-xl shadow-lg p-6">
            <h2 className="text-3xl font-bold text-primary mb-4">👤 Edit Profile</h2>
            <p className="text-text-secondary mb-6">
                Keep your public-facing profile up-to-date. Your name, bio, and avatar are managed here.
            </p>
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <p className="text-text-secondary">The ability to, like, edit your profile is coming soon!</p>
            </div>
        </div>
    );
};

export default ProfilePage; 