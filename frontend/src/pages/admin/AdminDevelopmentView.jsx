import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { useMarketStore } from "../../store/useMarketStore";
import AdminLayout from "../../layouts/AdminLayout";

const AdminDevelopmentView = () => {
    const { devId } = useParams();
    const navigate = useNavigate();

    const { postDev, postingDev } = useAdminStore();
    const { fetchDev, dev, isDevLoading } = useMarketStore();

    useEffect(() => {
        if (devId) {
            fetchDev(devId);
        }
    }, [devId, fetchDev]);

    const handleToggleStatus = async () => {
        if (!dev) return;

        // Convert current posted status and invert it
        const newStatus = !dev.posted;
        await postDev(devId, { status: newStatus });
        // Refresh the development data
        fetchDev(devId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isDevLoading) {
        return (
            <AdminLayout title="Loading Development...">
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-400">
                        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading development...</span>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!dev) {
        return (
            <AdminLayout title="Development Not Found">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Development Not Found</h3>
                        <p className="text-gray-400 mb-6">The development you're looking for doesn't exist or may have been deleted.</p>
                        <button
                            onClick={() => navigate('/admin/developments')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Developments
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`Development: ${dev.title || 'Untitled'}`}>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/developments')}
                        className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Developments
                    </button>
                </div>

                {/* Status Toggle */}
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-300 font-medium">Status:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 ${dev.posted
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}
                            onClick={handleToggleStatus}
                            title={`Click to ${dev.posted ? 'mark as draft' : 'publish'}`}
                        >
                            {dev.posted ? 'Published' : 'Draft'}
                        </span>
                    </div>

                    {postingDev && (
                        <div className="flex items-center gap-2 text-gray-400">
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Updating...</span>
                        </div>
                    )}
                </div>

                {/* Development Content */}
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {dev.title || "Untitled Development"}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            {dev.createdAt && (
                                <span>Created: {formatDate(dev.createdAt)}</span>
                            )}
                            {dev.updatedAt && dev.updatedAt !== dev.createdAt && (
                                <span>Updated: {formatDate(dev.updatedAt)}</span>
                            )}
                            {dev.content && (
                                <span>Words: {dev.content.split(' ').length}</span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="backdrop-blur-sm rounded-lg p-6">
                        {dev.content ? (
                            <div className="prose prose-invert max-w-none">
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {dev.content}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg">No content available</p>
                                <p className="text-sm mt-2">This development doesn't have any content yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDevelopmentView;
