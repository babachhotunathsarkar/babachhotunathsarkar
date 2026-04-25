import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPageContent, updatePageContentAPI, clearMessages } from '../../redux/pageContent/pageContentSlice';
import { 
    FileText, 
    Edit, 
    Save, 
    Loader2, 
    CheckCircle, 
    X, 
    Plus, 
    Trash2, 
    ArrowUp, 
    ArrowDown,
    Eye,
    ChevronRight,
    Lock,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

export default function AdminPolicyPage({ slug, title: pageTitle, icon: PageIcon }) {
    const dispatch = useDispatch();
    const { pages, loading, error, successMessage } = useSelector(s => s.pageContent);
    const pageData = pages[slug];
    
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ 
        title: '', 
        sections: [], 
        contactEmail: '', 
        contactPhone: '', 
        contactAddress: '' 
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchPageContent(slug));
    }, [slug, dispatch]);

    useEffect(() => {
        if (pageData) {
            setForm({
                title: pageData.title || '',
                sections: pageData.sections ? [...pageData.sections].sort((a, b) => a.order - b.order) : [],
                contactEmail: pageData.contactEmail || '',
                contactPhone: pageData.contactPhone || '',
                contactAddress: pageData.contactAddress || '',
            });
        }
    }, [pageData]);

    useEffect(() => {
        if (successMessage || error) {
            const t = setTimeout(() => dispatch(clearMessages()), 3000);
            return () => clearTimeout(t);
        }
    }, [successMessage, error, dispatch]);

    const handleSave = async () => {
        setSaving(true);
        await dispatch(updatePageContentAPI({ slug, data: form }));
        setSaving(false);
        setIsEditing(false);
    };

    const addSection = () => {
        setForm(f => ({
            ...f,
            sections: [...f.sections, { heading: '', body: '', order: f.sections.length }]
        }));
    };

    const updateSection = (idx, field, value) => {
        setForm(f => {
            const updated = [...f.sections];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...f, sections: updated };
        });
    };

    const removeSection = (idx) => {
        setForm(f => ({
            ...f,
            sections: f.sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i }))
        }));
    };

    const moveSection = (idx, dir) => {
        setForm(f => {
            const arr = [...f.sections];
            const newIdx = idx + dir;
            if (newIdx < 0 || newIdx >= arr.length) return f;
            [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
            return { ...f, sections: arr.map((s, i) => ({ ...s, order: i })) };
        });
    };

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto min-h-screen bg-transparent">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-inner">
                        {PageIcon ? <PageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            <span>Compliance Portal</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-orange-500">Editor</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{pageTitle}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href={slug === 'terms-and-conditions' ? '/terms-and-conditions' : `/${slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl font-bold transition-all hover:shadow-md active:scale-95"
                    >
                        <Eye className="w-4 h-4" />
                        Preview Site
                    </a>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-stone-200 active:scale-95"
                    >
                        <Edit className="w-4 h-4" />
                        Modify Content
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {successMessage && (
                <div className="flex items-center gap-3 bg-green-500 text-white p-4 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-6 h-6 shrink-0" />
                    <p className="font-bold">{successMessage}</p>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-3 bg-red-500 text-white p-4 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
                    <X className="w-6 h-6 shrink-0" />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            {/* View Mode */}
            {loading && !pageData ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Data...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {(!pageData?.sections || pageData.sections.length === 0) ? (
                        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                             <div className="w-20 h-20 rounded-full bg-gray-50 mx-auto flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-gray-200" />
                             </div>
                             <h2 className="text-xl font-bold text-gray-900 mb-2">No Content Established</h2>
                             <p className="text-gray-500 mb-8">This policy page is currently empty. Initialize it with custom content.</p>
                             <button 
                                onClick={() => setIsEditing(true)}
                                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all"
                             >
                                Get Started
                             </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-orange-500" />
                                    Active Content Protocol
                                </h3>
                                <div className="space-y-8">
                                    {pageData.sections.map((section, idx) => (
                                        <div key={idx} className="group relative">
                                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-orange-100 group-hover:bg-orange-500 transition-all rounded-full"></div>
                                            <h4 className="text-xl font-black text-gray-800 mb-3">{section.heading}</h4>
                                            <p className="text-gray-500 leading-relaxed whitespace-pre-line text-lg">{section.body}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-stone-900 to-black rounded-3xl p-8 text-white">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-6">Contact Protocol Binding</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Email</label>
                                        <p className="font-bold tracking-tight">{pageData.contactEmail || 'Not Binding'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Support Line</label>
                                        <p className="font-bold tracking-tight">{pageData.contactPhone || 'Not Binding'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Physical Uplink</label>
                                        <p className="font-bold tracking-tight">{pageData.contactAddress || 'Not Binding'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Form Overlay */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md overflow-y-auto pt-20 pb-20 no-scrollbar">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl p-8 md:p-12 border border-white/20 animate-in zoom-in-95 fade-in duration-300">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Modify Protocol Content</h2>
                                <p className="text-gray-500 font-medium mt-1">Configure legal sections and contact details for {pageTitle}.</p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all text-gray-500 shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-10">
                             {/* Page Title Input */}
                             <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Protocol Title</label>
                                <input 
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Enter page title"
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-white focus:border-orange-500 outline-none text-xl font-black transition-all shadow-sm"
                                />
                             </div>

                             {/* Sections List */}
                             <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xl font-black text-gray-900">Content Segments</h4>
                                    <button 
                                        onClick={addSection}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Initialize Segment
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {form.sections.map((section, idx) => (
                                        <div key={idx} className="p-6 bg-white border-2 border-gray-100 rounded-3xl space-y-4 hover:border-orange-100 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-50 px-3 py-1 rounded-full tracking-widest">Segment — {idx + 1}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-orange-500 disabled:opacity-20 transition-all">
                                                        <ArrowUp className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => moveSection(idx, 1)} disabled={idx === form.sections.length - 1} className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-orange-500 disabled:opacity-20 transition-all">
                                                        <ArrowDown className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => removeSection(idx)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <input 
                                                type="text"
                                                value={section.heading}
                                                onChange={e => updateSection(idx, 'heading', e.target.value)}
                                                placeholder="Segment Heading"
                                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                                            />
                                            <textarea 
                                                value={section.body}
                                                onChange={e => updateSection(idx, 'body', e.target.value)}
                                                placeholder="Describe protocol requirements..."
                                                rows={5}
                                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-medium text-gray-600 outline-none focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                             </div>

                             {/* Contact Info Group */}
                             <div className="bg-stone-900 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                                <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs">Uplink Configuration</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                     {[
                                        { key: 'contactEmail', label: 'Email Protocol', icon: Mail },
                                        { key: 'contactPhone', label: 'Comms Link', icon: Phone },
                                        { key: 'contactAddress', label: 'Physical Nexus', icon: MapPin },
                                     ].map((item) => (
                                         <div key={item.key}>
                                             <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">{item.label}</label>
                                             <input 
                                                type="text" 
                                                value={form[item.key]}
                                                onChange={e => setForm(f => ({ ...f, [item.key]: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold outline-none focus:bg-white/10 focus:border-orange-500 transition-all"
                                             />
                                         </div>
                                     ))}
                                </div>
                             </div>

                             <div className="flex flex-col sm:flex-row gap-4 pt-10">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 hover:bg-gray-50 text-gray-500 rounded-[2rem] font-black transition-all active:scale-95 shadow-sm"
                                >
                                    Abort Update
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-[2] px-10 py-5 bg-gradient-to-r from-orange-600 to-orange-400 hover:shadow-orange-200 text-white rounded-[2rem] font-black transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Commit Changes to Database
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
