import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmDialogOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmDialogContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export function useConfirm() {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmDialogProvider');
    }
    return context.confirm;
}

interface ConfirmDialogProviderProps {
    children: ReactNode;
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
    const [dialog, setDialog] = useState<{
        options: ConfirmDialogOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialog({ options, resolve });
        });
    }, []);

    const handleConfirm = () => {
        dialog?.resolve(true);
        setDialog(null);
    };

    const handleCancel = () => {
        dialog?.resolve(false);
        setDialog(null);
    };

    const variantStyles = {
        danger: {
            icon: <Trash2 className="w-6 h-6 text-red-500" />,
            iconBg: 'bg-red-100',
            confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
            iconBg: 'bg-amber-100',
            confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
        },
        info: {
            icon: <AlertTriangle className="w-6 h-6 text-blue-500" />,
            iconBg: 'bg-blue-100',
            confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
    };

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            {dialog && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Dialog */}
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-ink/20 overflow-hidden animate-slide-up">
                        {/* Close button */}
                        <button
                            onClick={handleCancel}
                            className="absolute right-4 top-4 p-1 rounded-full hover:bg-ink/5 transition-colors"
                        >
                            <X className="w-5 h-5 text-ink/40" />
                        </button>

                        {/* Content */}
                        <div className="p-6 pt-8">
                            {/* Icon */}
                            <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center ${variantStyles[dialog.options.variant || 'danger'].iconBg}`}>
                                {variantStyles[dialog.options.variant || 'danger'].icon}
                            </div>

                            {/* Text */}
                            <div className="mt-5 text-center">
                                <h3 className="text-lg font-semibold text-ink">
                                    {dialog.options.title || 'Confirm Action'}
                                </h3>
                                <p className="mt-2 text-sm text-ink/60 leading-relaxed">
                                    {dialog.options.message}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6 pt-2">
                            <Button
                                variant="ghost"
                                className="flex-1 h-11"
                                onClick={handleCancel}
                            >
                                {dialog.options.cancelText || 'Cancel'}
                            </Button>
                            <button
                                className={`flex-1 h-11 rounded-xl font-medium transition-all duration-200 ${variantStyles[dialog.options.variant || 'danger'].confirmBtn}`}
                                onClick={handleConfirm}
                            >
                                {dialog.options.confirmText || 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </ConfirmDialogContext.Provider>
    );
}
