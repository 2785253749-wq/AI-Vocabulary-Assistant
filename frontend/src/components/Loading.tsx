interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ text = '加载中...', fullScreen = false }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <span className="animate-spin inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      <p className="text-gray-500">{text}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{content}</div>;
  }

  return content;
}
