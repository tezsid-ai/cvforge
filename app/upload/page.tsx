"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AnalyzeButton from "@/components/upload/AnalyzeButton";
import FileDrop from "@/components/upload/FileDrop";
import JDInput from "@/components/upload/JDInput";
import BackButton from "@/components/ui/BackButton";
import { isAnalysisResult, type AnalysisResult } from "@/types/analysis";

export default function UploadPage(): React.JSX.Element {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [requestError, setRequestError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const canAnalyze = useMemo(
    () => Boolean(resumeFile) && jobDescription.trim().length > 0,
    [resumeFile, jobDescription],
  );

  const onAnalyze = async (): Promise<void> => {
    if (!canAnalyze || loading) {
      return;
    }

    if (!resumeFile) {
      setRequestError("Please upload a resume PDF.");
      return;
    }

    setLoading(true);
    setRequestError("");

    try {
      console.log("JD Length:", jobDescription.length);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as unknown;
      if (!response.ok) {
        const errorData = data as { error?: unknown };
        const message =
          typeof errorData.error === "string"
            ? errorData.error
            : "Failed to analyze resume. Please try again.";
        throw new Error(message);
      }

      if (!isAnalysisResult(data)) {
        throw new Error("Invalid analysis format.");
      }

      const resumeFromResponse = (data as { resumeText?: unknown }).resumeText;
      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      sessionStorage.setItem(
        "originalResume",
        typeof resumeFromResponse === "string" ? resumeFromResponse : "",
      );
      router.push("/results");

      console.log("Analyze response:", data);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Could not analyze right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] px-6 py-16 text-zinc-100 sm:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-3xl animate-fade-in-up rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-md sm:p-8">
        <div className="mb-5">
          <BackButton href="/" label="Back to Home" size="sm" />
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Optimize Your Resume for a Job
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
          Upload your resume and paste the job description to get improvements
        </p>

        <div className="mt-8 space-y-8">
          <FileDrop
            file={resumeFile}
            onFileSelect={setResumeFile}
            error={fileError}
            setError={setFileError}
          />
          <JDInput value={jobDescription} onChange={setJobDescription} />

          <div>
            <AnalyzeButton
              loading={loading}
              disabled={!canAnalyze}
              onClick={() => {
                void onAnalyze();
              }}
            />
            {requestError ? (
              <p className="mt-3 text-sm text-red-400">{requestError}</p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
