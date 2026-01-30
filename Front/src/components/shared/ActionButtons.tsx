import { Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface ActionButtonsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isDarkMode: boolean;
    viewDisabled?: boolean;
    editDisabled?: boolean;
    deleteDisabled?: boolean;
    color?: 'blue' | 'purple' | 'red' | 'green';
}

export function ActionButtons({
    onView,
    onEdit,
    onDelete,
    isDarkMode,
    viewDisabled,
    editDisabled,
    deleteDisabled,
    color = 'blue'
}: ActionButtonsProps) {
    const btnClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

    const getEditColorClass = () => {
        switch (color) {
            case 'purple': return 'text-purple-500';
            case 'red': return 'text-red-500';
            case 'green': return 'text-green-500';
            default: return 'text-blue-500';
        }
    };

    return (
        <div className="flex items-center gap-1">
            {onView && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onView}
                    disabled={viewDisabled}
                    className={`${btnClass} text-gray-500 h-8 w-8`}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            )}
            {onEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit}
                    disabled={editDisabled}
                    className={`${btnClass} ${getEditColorClass()} h-8 w-8`}
                >
                    <Edit className="w-4 h-4" />
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    disabled={deleteDisabled}
                    className={`${btnClass} text-red-500 h-8 w-8`}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
