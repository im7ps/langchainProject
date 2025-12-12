export default function FilePanel({
    open,
    files,
    onClose,
    onClickFile,
} : {
    open: boolean,
    files: { name: string, url?: string}[],
    onClose: () => void,
    onClickFile: (filename: string) => void,
}) {
    if (!open) return null;

    return (
        <aside className="ui-sidepanel">
            <div className="ui-sidepanel__header">
                <h3>File caricati</h3>
                <button onClick={onClose} className="ui-btn ui-btn--ghost">✕</button>
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
                </div>
                ))}
            </div>
        </aside>

    );
}