import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
    const components = {
        p: ({ node, children, ...props }: any) => (
            <p className="mb-4 text-gray-700 leading-relaxed" {...props}>
                {children}
            </p>
        ),
        h1: ({ node, children, ...props }: any) => (
            <h1 className="text-2xl font-bold mb-4 text-[#C37F38]" {...props}>
                {children}
            </h1>
        ),
        h2: ({ node, children, ...props }: any) => (
            <h2 className="text-xl font-semibold mb-3 text-[#D18D46]" {...props}>
                {children}
            </h2>
        ),
        h3: ({ node, children, ...props }: any) => (
            <h3 className="text-lg font-medium mb-2 text-[#E09B54]" {...props}>
                {children}
            </h3>
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <pre
                    {...props}
                    className={`${className} text-sm w-full overflow-x-auto bg-[#F7F3EF] p-4 rounded-lg my-4 border border-[#E09B54]`}
                >
                    <code className={`language-${match[1]} text-[#525252]`}>{children}</code>
                </pre>
            ) : (
                <code
                    className={`${className} text-sm bg-[#F7F3EF] text-[#C37F38] py-0.5 px-2 rounded`}
                    {...props}
                >
                    {children}
                </code>
            );
        },
        ol: ({ node, children, ...props }: any) => (
            <ol className="list-decimal list-outside ml-6 mb-4 text-gray-700" {...props}>
                {children}
            </ol>
        ),
        ul: ({ node, children, ...props }: any) => (
            <ul className="list-disc list-outside ml-6 mb-4 text-gray-700" {...props}>
                {children}
            </ul>
        ),
        li: ({ node, children, ...props }: any) => (
            <li className="mb-2" {...props}>
                {children}
            </li>
        ),
        strong: ({ node, children, ...props }: any) => (
            <span className="font-bold text-[#C37F38]" {...props}>
                {children}
            </span>
        ),
        em: ({ node, children, ...props }: any) => (
            <span className="italic text-[#D18D46]" {...props}>
                {children}
            </span>
        ),
        a: ({ node, children, href, ...props }: any) => (
            <a
                href={href}
                className="text-[#C37F38] hover:text-[#E09B54] underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </a>
        ),
        blockquote: ({ node, children, ...props }: any) => (
            <blockquote
                className="border-l-4 border-[#E09B54] pl-4 py-2 mb-4 italic text-gray-600 bg-[#F7F3EF] rounded-r-lg"
                {...props}
            >
                {children}
            </blockquote>
        ),
        hr: ({ node, ...props }: any) => (
            <hr className="my-8 border-t border-[#E09B54]" {...props} />
        ),
        table: ({ node, children, ...props }: any) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-[#E09B54]" {...props}>
                    {children}
                </table>
            </div>
        ),
        th: ({ node, children, ...props }: any) => (
            <th className="border border-[#E09B54] px-4 py-2 bg-[#F7F3EF] text-[#C37F38] font-semibold" {...props}>
                {children}
            </th>
        ),
        td: ({ node, children, ...props }: any) => (
            <td className="border border-[#E09B54] px-4 py-2 text-gray-700" {...props}>
                {children}
            </td>
        ),
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components}
            className="text-base"
        >
            {children}
        </ReactMarkdown>
    );
};

export const Markdown = React.memo(
    NonMemoizedMarkdown,
    (prevProps, nextProps) => prevProps.children === nextProps.children,
);