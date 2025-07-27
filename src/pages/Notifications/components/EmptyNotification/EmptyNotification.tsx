import { BellOff } from "lucide-react";

export default function EmptyNotification() {
  return (
    <div className="flex flex-col items-center justify-center py-26 px-4 text-center">
      <BellOff className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-base font-medium text-gray-600 mb-2">
        No notifications
      </h3>
      <p className="text-sm text-gray-400">
        All notifications will appear here
      </p>
    </div>
  );
}
