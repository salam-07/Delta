import { RefreshCw, Edit, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const DevTable = ({
    devs = [],
    isLoading = false,
    onRefresh = () => { },
    onToggleStatus = null,
    onEdit = null,
    onDelete = null,
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
                        <p className="text-gray-500">Create your first development to get started.</p>
                    </div>
                </div>
            ) : (
                /* Responsive Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {devs.map((dev) => (
                        <div
                            key={dev._id}
                            className="backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-gray-600/50 transition-all duration-200 group"
                        >
                            {/* Header with Actions */}
                            <div className="flex justify-between items-start mb-3">
                                {/* Status Badge */}
                                {dev.posted !== undefined && (
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${dev.posted
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            } ${onToggleStatus ? 'cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200' : ''}`}
                                        onClick={onToggleStatus ? (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onToggleStatus(dev._id, dev.posted ? 'published' : 'draft');
                                        } : undefined}
                                        title={onToggleStatus ? `Click to ${dev.posted ? 'mark as draft' : 'publish'}` : undefined}
                                    >
                                        {dev.posted ? 'Published' : 'Draft'}
                                    </span>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* View/Edit Link */}
                                    <Link
                                        to={`/admin/developments/${dev._id}`}
                                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                        title="View Details"
                                    >
                                        <ExternalLink size={14} />
                                    </Link>

                                    {/* Edit Button */}
                                    {onEdit && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onEdit(dev);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors"
                                            title="Edit Development"
                                        >
                                            <Edit size={14} />
                                        </button>
                                    )}

                                    {/* Delete Button */}
                                    {onDelete && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onDelete(dev._id);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                            title="Delete Development"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                                {dev.title || "Untitled Development"}
                            </h4>

                            {/* Content Preview */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                                {truncateContent(dev.content)}
                            </p>

                            {/* Stock Price Changes Indicator */}
                            {dev.stockPriceChanges && dev.stockPriceChanges.length > 0 && (
                                <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                                    <div className="text-yellow-400 font-medium">
                                        Stock Price Changes ({dev.stockPriceChanges.length})
                                    </div>
                                    <div className="text-gray-400 mt-1">
                                        {dev.stockPriceChanges.slice(0, 3).map(change => change.ticker).join(", ")}
                                        {dev.stockPriceChanges.length > 3 && "..."}
                                    </div>
                                </div>
                            )}

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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DevTable;
