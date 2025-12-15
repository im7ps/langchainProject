import "../../custom-css/filePanel.css";

export default function FilePanel({
    open,
    files,
    onClickFile,
    onDeleteFile,
} : {
    open: boolean,
    files: { name: string, url?: string}[],
    onClickFile: (filename: string) => void,
    onDeleteFile: (filename: string) => void,
}) {
    if (!open) return null;

    return (
        <aside className="ui-sidepanel">
            <div className="ui-sidepanel__header">
                <h3>File caricati</h3>
            </div>

            <div className="file-panel-body ui-scroll">
                {files.length === 0 && (
                <div className="no-files">Nessun file caricato.</div>
                )}

                {files.map((f, i) => (
                <div
                    key={i}
                    className="ui-sidepanel__item"
                    onClick={() => onClickFile(f.name)}
                >
                    <span className="file-icon">📄</span>
                    <span className="file-name">{f.name}</span>
                    <button
                      className="ui-btn ui-btn--danger delete-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(f.name);
                      }}
                    >
                      ✕
                    </button>
                </div>
                ))}
            </div>
        </aside>

    );
}