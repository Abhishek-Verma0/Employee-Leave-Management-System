const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      {message}
    </div>
  );
};

export default ErrorAlert;
