import { useEffect } from "react";
import UserDevTable from "../../components/user/UserDevTable";
import UserLayout from "../../layouts/UserLayout";
import { useMarketStore } from "../../store/useMarketStore";

const UserDevelopments = () => {
    const { fetchAllDev, devs, isDevsLoading } = useMarketStore();

    useEffect(() => {
        fetchAllDev();
    }, [fetchAllDev]);

    return (
        <UserLayout title="Developments">
            <UserDevTable
                devs={devs}
                isLoading={isDevsLoading}
                onRefresh={fetchAllDev}
                title="The wire"
            />
        </UserLayout>
    );
};

export default UserDevelopments;
