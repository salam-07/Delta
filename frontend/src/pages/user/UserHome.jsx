import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import UserStockTable from '../../components/user/UserStockTable';

const UserHome = () => {
    return (
        <UserLayout>

            <UserStockTable />
        </UserLayout>
    );
};

export default UserHome;