import React from "react";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Customer details" },
  { id: 2, label: "IPRS match" },
  { id: 3, label: "Result & audit log" },
];

const Stepper = ({ step, title, subtitle }) => {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold tracking-wide text-emerald-600 dark:text-emerald-400 uppercase">
        Step {step} of {STEPS.length}
      </p>

      <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mt-1">
        {title}
      </h1>

      <p className="text-slate-500 dark:text-slate-400 mt-1">
        {subtitle}
      </p>

      <div className="flex items-center mt-6">
        {STEPS.map((s, index) => {
          const isDone = s.id < step;
          const isCurrent = s.id === step;

          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0
                    ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }
                  `}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.id}
                </div>

                <span
                  className={`text-sm font-medium hidden sm:block ${
                    isCurrent || isDone
                      ? "text-slate-800 dark:text-white"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isDone ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
