import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerms, updateTermsAction, resetTermsState } from '../../redux/terms/termsSlice';
import { FileText, Save, Loader2, CheckCircle, X, Edit, Eye } from 'lucide-react';

export default function AdminTermsManagement() {
    const dispatch = useDispatch();
    const { terms, loading, error, success } = useSelector(s => s.terms);
    
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        dispatch(fetchTerms());
    }, [dispatch]);

    useEffect(() => {
        if (terms) {
            setTitle(terms.title || '');
            setContent(terms.content || '');
        }
    }, [terms]);

    useEffect(() => {
        if (success || error) {
            const t = setTimeout(() => dispatch(resetTermsState()), 3000);
            return () => clearTimeout(t);
        }
    }, [success, error, dispatch]);

    const handleSave = async () => {
        await dispatch(updateTermsAction({ title, content }));
        setIsEditing(false);
    };

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Terms & Conditions</h1>
                        <p className="text-gray-500 text-sm font-medium tracking-tight">Manage user agreement protocols.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <a href="/terms-and-conditions" target="_blank" className="flex items-center gap-2 px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all">
                        <Eye className="w-4 h-4" /> View Live
                    </a>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-lg active:scale-95">
                        <Edit className="w-4 h-4" /> Edit Policy
                    </button>
                </div>
            </div>

            {success && (
                <div className="flex items-center gap-2 bg-green-500 text-white p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5" /> <span className="font-bold">Terms & Conditions updated successfully!</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 bg-red-500 text-white p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <X className="w-5 h-5" /> <span className="font-bold">{error}</span>
                </div>
            )}

            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                {!isEditing ? (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-gray-900">{terms?.title}</h2>
                        <div className="prose prose-orange max-w-none text-gray-500 whitespace-pre-line text-lg leading-relaxed">
                            {terms?.content || 'No policy content added yet.'}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Policy Title</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none text-xl font-bold transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Policy Content (HTML Supported)</label>
                            <textarea 
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={15}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none text-lg leading-relaxed transition-all font-medium text-gray-600"
                            />
                        </div>
                        <div className="flex gap-4 pt-6">
                            <button onClick={() => setIsEditing(false)} className="flex-1 px-8 py-4 border-2 border-gray-100 hover:bg-gray-50 text-gray-500 rounded-2xl font-black transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={loading} className="flex-[2] px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Push Updates
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
