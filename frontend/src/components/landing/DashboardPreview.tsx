
const DashboardPreview = () => {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Visibility into every part of your project
                    </h2>
                    <p className="text-lg text-slate-600">
                        One centralized dashboard to track progress, costs, and safety across your entire portfolio.
                    </p>
                </div>

                <div className="relative mx-auto max-w-6xl">
                    {/* Browser Window Mockup */}
                    <div className="rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                        {/* Browser Header */}
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 bg-white border border-slate-200 rounded-md py-1 px-4 text-xs text-slate-400 text-center mx-12">
                                app.constructflow.com/dashboard/project-alpha
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600"></div>
                        </div>

                        {/* Dashboard Content Mockup */}
                        <div className="flex flex-col md:flex-row h-[600px] bg-slate-50">
                            {/* Sidebar */}
                            <div className="w-20 md:w-64 bg-slate-900 flex-shrink-0 flex flex-col pt-6 hidden md:flex">
                                <div className="px-6 mb-8 text-white font-bold text-xl">CF Admin</div>
                                <div className="flex-1 space-y-1 px-3">
                                    <div className="p-3 bg-primary-600 rounded-lg text-white font-medium text-sm flex items-center gap-3">
                                        <div className="w-5 h-5 bg-white/20 rounded"></div> Dashboard
                                    </div>
                                    <div className="p-3 text-slate-400 hover:bg-slate-800 rounded-lg font-medium text-sm flex items-center gap-3">
                                        <div className="w-5 h-5 bg-slate-700 rounded"></div> Projects
                                    </div>
                                    <div className="p-3 text-slate-400 hover:bg-slate-800 rounded-lg font-medium text-sm flex items-center gap-3">
                                        <div className="w-5 h-5 bg-slate-700 rounded"></div> Tasks
                                    </div>
                                    <div className="p-3 text-slate-400 hover:bg-slate-800 rounded-lg font-medium text-sm flex items-center gap-3">
                                        <div className="w-5 h-5 bg-slate-700 rounded"></div> Financials
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="min-w-0 flex-1 p-8 overflow-y-auto">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">Project Alpha: HQ Expansion</h3>
                                        <p className="text-sm text-slate-500">Updated 12 mins ago</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600">Export Report</button>
                                        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">Add Task</button>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">Total Budget</div>
                                        <div className="text-2xl font-bold text-slate-900">$12.4M</div>
                                        <div className="text-xs text-emerald-600 flex items-center mt-2">+2.4% under budget</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">Tasks Completed</div>
                                        <div className="text-2xl font-bold text-slate-900">1,248</div>
                                        <div className="text-xs text-emerald-600 flex items-center mt-2">84% complete</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">Open RFIs</div>
                                        <div className="text-2xl font-bold text-slate-900">12</div>
                                        <div className="text-xs text-amber-500 flex items-center mt-2">4 urgent items</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">Safety Incidents</div>
                                        <div className="text-2xl font-bold text-slate-900">0</div>
                                        <div className="text-xs text-emerald-600 flex items-center mt-2">142 days streak</div>
                                    </div>
                                </div>

                                {/* Charts Area */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="h-6 w-32 bg-slate-100 rounded mb-6"></div>
                                        <div className="h-64 bg-slate-50 rounded-lg flex items-end justify-between px-8 pb-4 gap-4">
                                            <div className="w-full bg-primary-100 rounded-t-lg h-[40%]"></div>
                                            <div className="w-full bg-primary-200 rounded-t-lg h-[60%]"></div>
                                            <div className="w-full bg-primary-300 rounded-t-lg h-[45%]"></div>
                                            <div className="w-full bg-primary-400 rounded-t-lg h-[75%]"></div>
                                            <div className="w-full bg-primary-500 rounded-t-lg h-[55%]"></div>
                                            <div className="w-full bg-primary-600 rounded-t-lg h-[80%]"></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="h-6 w-24 bg-slate-100 rounded mb-6"></div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <div className="flex-1 h-2 bg-slate-200 rounded"></div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                <div className="flex-1 h-2 bg-slate-200 rounded"></div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <div className="flex-1 h-2 bg-slate-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
