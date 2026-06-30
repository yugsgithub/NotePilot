

{message.sources?.length > 0 && (
  <div className="mt-6 pt-6 border-t border-slate-800">

    <div className="flex items-center justify-between mb-5">

      <h3 className="text-lg font-semibold">
        📚 Sources Used
      </h3>

      <span className="text-sm text-slate-400">
        {message.sources.length} source
        {message.sources.length > 1 ? "s" : ""}
      </span>

    </div>

    <div className="space-y-4">

      {message.sources.map((source, i) => (

        <div
          key={i}
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-2xl
            shadow-lg
            p-5
            hover:border-blue-500
            transition-all
          "
        >

          <div className="flex items-center gap-3 mb-3">

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-blue-600
                flex
                items-center
                justify-center
                font-semibold
                text-white
              "
            >
              {i + 1}
            </div>

            <div>

              <p className="font-semibold">
                Source {i + 1}
              </p>

              <p className="text-sm text-slate-400">
                Retrieved Context
              </p>

            </div>

          </div>

          <div
            className="
              bg-[#0B1120]
              border
              border-slate-700
              rounded-xl
              p-4
            "
          >
            <p className="text-sm text-slate-300 leading-7">
              {source}
            </p>
          </div>

        </div>

      ))}

    </div>

  </div>
)}