import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { useMarketStore } from "../../store/useMarketStore";
import DevTable from "../../components/admin/AdminDevTable";
import AdminLayout from "../../layouts/AdminLayout";

const AdminDevelopments = () => {
    const {
        createDev,
        deleteDev,
        postDev,
        deletingDevId,
        updateDev,
        creatingDev,
        updatingDev,
        postingDev,
    } = useAdminStore();

    const {
        fetchAllDev,
        devs,
        fetchDev,
        dev,
        isDevsLoading,
        isDevLoading
    } = useMarketStore();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });

    // Fetch stocks on component mount
    useEffect(() => {
        fetchAllDev();
    }, [fetchAllDev]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            return;
        }

        await createDev({
            title: formData.title,
            content: formData.content,
        });

        // Reset form
        setFormData({ title: "", content: "" });
        setShowCreateForm(false);
    };

    const resetForm = () => {
        setFormData({ title: "", content: "" });
        setShowCreateForm(false);
    };

    const handleDelete = async (devId) => {
        if (window.confirm("Are you sure you want to delete this development? This action cannot be undone.")) {
            await deleteDev(devId);
        }
    };

    const handleEdit = async (devId, newContent) => {
        await updateDev(devId, {
            content: newContent,
        });
    };

    const handleToggleStatus = async (devId, currentStatus) => {
        // Convert currentStatus string to boolean and invert it
        const newStatus = currentStatus === 'draft'; // draft becomes true (published), published becomes false (draft)
        await postDev(devId, { status: newStatus });
        // Refresh the developments list to show updated status
        fetchAllDev();
    };

    return (
        <AdminLayout title="Development Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Development Management</h2>
                        <p className="text-gray-400 mt-1">Create and manage developments</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Create Development Form */}
                {showCreateForm && (
                    <div className="backdrop-blur-sm rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="text-green-500" size={24} />
                            <h3 className="text-xl font-semibold text-white">Create New Development</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* Development Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Development Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter development title..."
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Development Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Enter development content..."
                                        rows={6}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-y"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                                <button
                                    type="submit"
                                    disabled={creatingDev}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    {creatingDev ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create Development
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Developments Grid Section */}
                <DevTable
                    devs={devs}
                    isLoading={isDevsLoading}
                    onRefresh={fetchAllDev}
                    onToggleStatus={handleToggleStatus}
                    showRefreshButton={true}
                    title="All Developments"
                />
            </div>
        </AdminLayout>
    );
};

export default AdminDevelopments;
