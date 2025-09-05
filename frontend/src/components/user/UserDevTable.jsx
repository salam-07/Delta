import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const DevTable = ({
    devs = [],
    isLoading = false,
    onRefresh = () => { },
    showRefreshButton = true,
    title = "Developments"
}) => {
    // Helper function to truncate content to first few lines
    const truncateContent = (content, maxLength = 150) => {
        if (!content) return "";
        if (content.length <= maxLength) return content;

        // Find the last space before maxLength to avoid cutting words
        const truncated = content.substr(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.substr(0, lastSpace) + "..." : truncated + "...";
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                {showRefreshButton && (
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg transition-colors hover:bg-gray-800/50"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                )}
            </div>

            {/* Loading State */}
            {isLoading && devs.length === 0 ? (
                <div className="text-gray-400 text-center py-12">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        Loading developments...
                    </div>
                </div>
            ) : devs.length === 0 ? (
                /* Empty State */
                <div className="text-gray-400 text-center py-12">
                    <div className="rounded-lg p-8">
                        <h4 className="text-lg font-medium text-gray-300 mb-2">No Developments Found</h4>
                        <p className="text-gray-500">No Developments have been made in the market.</p>
                    </div>
                </div>
            ) : (
                /* Responsive Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {devs.filter(dev => dev.posted === true).map((dev) => (
                        <Link
                            key={dev._id}
                            to={`/user/developments/${dev._id}`}
                            className=" backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-gray-600/50 transition-all duration-200 cursor-pointer group block"
                        >
                            {/* Status Badge */}
                            {dev.posted !== undefined && (
                                <div className="flex justify-end mb-3">
                                    <span
                                        className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30"
                                    >
                                        Published
                                    </span>
                                </div>
                            )}

                            {/* Title */}
                            <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                                {dev.title || "Untitled Development"}
                            </h4>

                            {/* Content Preview */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                                {truncateContent(dev.content)}
                            </p>

                            {/* Footer */}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                                {/* Date */}
                                <span className="text-xs text-gray-500">
                                    {formatDate(dev.createdAt) || formatDate(dev.updatedAt) || "No date"}
                                </span>

                                {/* Word Count Indicator */}
                                <span className="text-xs text-gray-500">
                                    {dev.content ? `${dev.content.split(' ').length} words` : "No content"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DevTable;
