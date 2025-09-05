import UserLayout from "../../layouts/UserLayout";

const UserHelp = () => {
    return (
        <UserLayout title="Help & FAQ">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Help & Support</h1>
                    <p className="text-gray-400">Find answers to frequently asked questions</p>
                </div>

                {/* Accordion */}
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="collapse collapse-arrow border border-gray-700">
                        <input type="radio" name="help-accordion" defaultChecked />
                        <div className="collapse-title text-xl font-medium text-white">
                            How do I start trading stocks?
                        </div>
                        <div className="collapse-content">
                            <div className="text-gray-300 space-y-3">
                                <p>Getting started with trading is easy:</p>
                                <ol className="list-decimal list-inside space-y-2 ml-4">
                                    <li>Navigate to the "Trade" section from your dashboard</li>
                                    <li>Select a stock from the dropdown menu</li>
                                    <li>Choose whether you want to buy or sell</li>
                                    <li>Enter the number of shares you want to trade</li>
                                    <li>Review the trade summary and click the trade button</li>
                                </ol>
                                <p className="text-sm text-gray-400 mt-4">
                                    <strong>Note:</strong> Make sure you have sufficient balance for buying stocks or own shares for selling.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="collapse collapse-arrow border border-gray-700">
                        <input type="radio" name="help-accordion" />
                        <div className="collapse-title text-xl font-medium text-white">
                            How do I check my portfolio and account balance?
                        </div>
                        <div className="collapse-content">
                            <div className="text-gray-300 space-y-3">
                                <p>You can monitor your investments through multiple sections:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Portfolio:</strong> View all your holdings, total assets, and performance metrics</li>
                                    <li><strong>Home Dashboard:</strong> Quick overview of your account balance and recent activity</li>
                                    <li><strong>History:</strong> Detailed transaction history and trade records</li>
                                </ul>
                                <p className="mt-4">Your account balance and portfolio value are updated in real-time after each transaction.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Help Section */}
                <div className="mt-12 text-center">
                    <div className="p-6 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-white mb-2">Need More Help?</h3>
                        <p className="text-gray-400 mb-4">
                            Can't find what you're looking for? Our support team is here to help you with any questions.
                        </p>
                        <p className="text-gray-400">Contact at: <span className="text-green-400">0333-729-8886</span></p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default UserHelp;