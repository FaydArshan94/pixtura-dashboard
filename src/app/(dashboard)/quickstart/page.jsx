"use client";

import { useState } from "react";
import { Check, Copy, Key, Upload, Zap, Globe } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";

const CodeBlock = ({ code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-[#0f1117]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const Step = ({ number, icon: Icon, title, children }) => (
  <div className="flex gap-6">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-xl bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#0066cc]" />
      </div>
      <div className="w-px flex-1 bg-slate-200 mt-3" />
    </div>
    <div className="pb-10 flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-bold text-[#0066cc] uppercase tracking-widest">
          Step {number}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  </div>
);

const ParamRow = ({ param, type, description, example }) => (
  <tr className="border-t border-slate-100">
    <td className="py-3 pr-4">
      <code className="text-sm font-mono font-semibold text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded">
        {param}
      </code>
    </td>
    <td className="py-3 pr-4">
      <span className="text-xs text-slate-500 font-mono">{type}</span>
    </td>
    <td className="py-3 pr-4 text-sm text-slate-600">{description}</td>
    <td className="py-3 text-sm font-mono text-slate-500">{example}</td>
  </tr>
);

export default function QuickstartPage() {
  const CLOUDFRONT_URL = "https://your-cloudfront-url.cloudfront.net";
  const API_URL = "https://your-api-url.com";

  const uploadCode = `const formData = new FormData();
formData.append("file", file); // File object from input or drop

const response = await fetch("${API_URL}/api/media/upload", {
  method: "POST",
  headers: {
    "x-api-key": "your-api-key-here",
  },
  body: formData,
});

const data = await response.json();
// { message: "File uploaded successfully", s3Key: "uuid-filename.jpg" }`;

  const serveCode = `// Basic — serve original
const url = "${CLOUDFRONT_URL}/uuid-filename.jpg";

// With transformations
const url = "${CLOUDFRONT_URL}/uuid-filename.jpg?w=800&format=webp&quality=80";

// Use it anywhere
<img src={url} alt="My image" />`;

  const transformCode = `// Resize to 300px wide, auto height
?w=300

// Resize to exact dimensions
?w=300&h=300

// Convert format
?format=webp

// Set quality (1-100)
?quality=80

// All combined
?w=600&format=webp&quality=75&fit=cover`;

  const reactCode = `import { useState } from "react";

const API_KEY = "your-api-key-here";
const CDN_URL = "${CLOUDFRONT_URL}";

export function ImageUploader() {
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("${API_URL}/api/media/upload", {
      method: "POST",
      headers: { "x-api-key": API_KEY },
      body: formData,
    });

    const { s3Key } = await res.json();
    setImageUrl(\`\${CDN_URL}/\${s3Key}?w=800&format=webp&quality=80\`);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
      />
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}`;

  return (

      <div className="min-h-screen bg-[#f3f7f9] font-sans antialiased">
        {/* Top Banner */}
        {/* <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#0066cc] flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg">imagix</span>
          <span className="text-slate-300 mx-1">/</span>
          <span className="text-slate-500 text-sm">Quickstart</span>
        </div>
        <Link
          href="/api-keys"
          className="text-sm font-semibold text-[#0066cc] hover:underline flex items-center gap-1.5"
        >
          <Key size={14} />
          Get your API key
        </Link>
      </div> */}

        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-[#0066cc]/10 text-[#0066cc] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
              <Zap size={11} />
              Developer Quickstart
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-3">
              Integrate Pixtura in 5 minutes
            </h1>
            <p className="text-lg text-slate-500">
              Upload images, serve them globally, transform on the fly — all via
              a single API key.
            </p>
          </div>

          {/* Steps */}
          <div>
            <Step number={1} icon={Key} title="Get your API key">
              <p className="text-sm text-slate-600 mb-4">
                Go to the{" "}
                <Link
                  href="/api-keys"
                  className="text-[#0066cc] font-semibold hover:underline"
                >
                  API Keys page
                </Link>{" "}
                and generate your key. Copy it — it's shown only once.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-medium">
                ⚠ Store your API key securely. Never expose it in client-side
                code or public repositories.
              </div>
            </Step>

            <Step number={2} icon={Upload} title="Upload an image">
              <p className="text-sm text-slate-600 mb-4">
                Send a{" "}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  multipart/form-data
                </code>{" "}
                POST request with your file attached as{" "}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  file
                </code>
                .
              </p>
              <CodeBlock code={uploadCode} language="javascript" />
              <p className="text-xs text-slate-500 mt-3">
                The response includes the{" "}
                <code className="font-mono">s3Key</code> — use this to construct
                your image URL.
              </p>
            </Step>

            <Step number={3} icon={Globe} title="Serve your image">
              <p className="text-sm text-slate-600 mb-4">
                Images are served via CloudFront CDN. Append the{" "}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  s3Key
                </code>{" "}
                to your CDN base URL.
              </p>
              <CodeBlock code={serveCode} language="javascript" />
            </Step>

            <Step number={4} icon={Zap} title="Transform on the fly">
              <p className="text-sm text-slate-600 mb-4">
                Append query params to any image URL to resize, convert, or
                compress in real time. Transformations are cached at the edge
                after the first request.
              </p>
              <CodeBlock code={transformCode} language="bash" />
            </Step>
          </div>

          {/* Params Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-10">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Transformation parameters
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                      Param
                    </th>
                    <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">
                      Type
                    </th>
                    <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">
                      Description
                    </th>
                    <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="px-6">
                  <tr className="border-t border-slate-100">
                    <td className="py-3 px-6">
                      <code className="text-sm font-mono font-semibold text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded">
                        w
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-500 font-mono">
                        number
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      Output width in pixels
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-slate-500">
                      w=300
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 px-6">
                      <code className="text-sm font-mono font-semibold text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded">
                        h
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-500 font-mono">
                        number
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      Output height in pixels
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-slate-500">
                      h=200
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 px-6">
                      <code className="text-sm font-mono font-semibold text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded">
                        format
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-500 font-mono">
                        string
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      Output format
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-slate-500">
                      format=webp
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 px-6">
                      <code className="text-sm font-mono font-semibold text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded">
                        quality
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-500 font-mono">
                        number
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      Compression quality (1–100)
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-slate-500">
                      quality=80
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 px-6">
                      <code className="text-sm font-mono font-semibold text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded">
                        fit
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-500 font-mono">
                        string
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      Resize strategy when both w and h are set
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-slate-500">
                      fit=cover
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Supported formats: <code className="font-mono">jpeg</code>,{" "}
                <code className="font-mono">png</code>,{" "}
                <code className="font-mono">webp</code>,{" "}
                <code className="font-mono">avif</code> · Fit values:{" "}
                <code className="font-mono">cover</code>,{" "}
                <code className="font-mono">contain</code>,{" "}
                <code className="font-mono">fill</code>,{" "}
                <code className="font-mono">inside</code>,{" "}
                <code className="font-mono">outside</code>
              </p>
            </div>
          </div>

          {/* Full Example */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Full React example
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Upload a file and display it with transformations applied.
              </p>
            </div>
            <div className="p-6">
              <CodeBlock code={reactCode} language="jsx" />
            </div>
          </div>
        </div>
      </div>

  );
}
