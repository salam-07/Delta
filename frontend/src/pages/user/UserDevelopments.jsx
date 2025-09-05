import { useEffect } from "react";
import DevTable from "../../components/user/UserDevTable";
import UserLayout from "../../layouts/UserLayout";
import { useMarketStore } from "../../store/useMarketStore";


const UserDevelopments = () => {

    const {
        fetchAllDev,
        devs,
        fetchDev,
        dev,
        isDevsLoading,
        isDevLoading
    } = useMarketStore();

    useEffect(() => {
        fetchAllDev();
    }, [fetchAllDev]);

    return (
        <UserLayout>
            <div>UserDevelopments</div>
            <DevTable
                devs={devs}
                isLoading={isDevsLoading}
                onRefresh={fetchAllDev}
                showRefreshButton={true}
                title="All Developments"
            />
        </UserLayout>
    );
};

export default UserDevelopments;