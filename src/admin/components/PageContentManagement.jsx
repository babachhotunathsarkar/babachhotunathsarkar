import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPageContent, updatePageContentAPI, clearMessages } from '../../redux/pageContent/pageContentSlice';
import { FileText, Plus, Trash2, Save, ArrowUp, ArrowDown, Loader2, CheckCircle, X } from 'lucide-react';

const SLUGS = [
    { slug: 'privacy-policy', label: 'Privacy Policy', icon: '🔒' },
    { slug: 'terms-conditions', label: 'Terms & Conditions', icon: '📋' },
];

export default function PageContentManagement() {
    const dispatch = useDispatch();
    const { pages, loading, error, successMessage } = useSelector(s => s.pageContent);
    const [activeSlug, setActiveSlug] = useState('privacy-policy');
    const [form, setForm] = useState({ title: '', sections: [], contactEmail: '', contactPhone: '', contactAddress: '' });
    const [saving, setSaving] = useState(false);

    // Load on slug change
    useEffect(() => {
        dispatch(fetchPageContent(activeSlug));
    }, [activeSlug, dispatch]);

    // Sync form when page data loads
    useEffect(() => {
        const page = pages[activeSlug];
        if (page) {
            setForm({
                title: page.title || '',
                sections: page.sections ? [...page.sections].sort((a, b) => a.order - b.order) : [],
                contactEmail: page.contactEmail || '',
                contactPhone: page.contactPhone || '',
                contactAddress: page.contactAddress || '',
            });
        }
    }, [pages, activeSlug]);

    useEffect(() => {
        if (successMessage || error) {
            const t = setTimeout(() => dispatch(clearMessages()), 3000);
            return () => clearTimeout(t);
        }
    }, [successMessage, error, dispatch]);

    const handleSave = async () => {
        setSaving(true);
        await dispatch(updatePageContentAPI({ slug: activeSlug, data: form }));
        setSaving(false);
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
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-7 h-7 text-indigo-600" /> Page Content Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Edit Privacy Policy and Terms & Conditions content dynamically.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Page
                </button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 border-b border-gray-200">
                {SLUGS.map(({ slug, label, icon }) => (
                    <button
                        key={slug}
                        onClick={() => setActiveSlug(slug)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeSlug === slug
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span>{icon}</span> {label}
                    </button>
                ))}
            </div>

            {/* Feedback */}
            {successMessage && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5" /> {successMessage}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-200">
                    <X className="w-5 h-5" /> {error}
                </div>
            )}

            {loading && !pages[activeSlug] ? (
                <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin" /></div>
            ) : (
                <div className="space-y-6">
                    {/* Page Title */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-base font-semibold"
                            placeholder="Page Title"
                        />
                    </div>

                    {/* Content Sections */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-gray-900">Content Sections</h2>
                            <button onClick={addSection} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
                                <Plus className="w-4 h-4" /> Add Section
                            </button>
                        </div>

                        {form.sections.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-6">No sections yet. Click "Add Section".</p>
                        )}

                        <div className="space-y-4">
                            {form.sections.map((section, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section {idx + 1}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 disabled:opacity-30">
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => moveSection(idx, 1)} disabled={idx === form.sections.length - 1} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 disabled:opacity-30">
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => removeSection(idx)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={section.heading}
                                        onChange={e => updateSection(idx, 'heading', e.target.value)}
                                        placeholder="Section heading"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 outline-none text-sm font-semibold"
                                    />
                                    <textarea
                                        value={section.body}
                                        onChange={e => updateSection(idx, 'body', e.target.value)}
                                        placeholder="Section content..."
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 outline-none text-sm resize-y leading-relaxed"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-gray-900">Contact Details (shown on page)</h2>
                        {[
                            { key: 'contactEmail', label: 'Email', placeholder: 'contact@temple.org' },
                            { key: 'contactPhone', label: 'Phone', placeholder: '+91 XXXXXXXXXX' },
                            { key: 'contactAddress', label: 'Address', placeholder: 'Temple address' },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <input
                                    type="text"
                                    value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    placeholder={placeholder}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
