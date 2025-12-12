import folderIcon from "../../assets/svg_folder_icon.svg";
import UploadFiles from "./uploadFiles";

export default function FileManager({
    onUpload,
    onOpenPanel } : 
    {
        onUpload: (file: File) => void,
        onOpenPanel: () => void 
    }) {
    return (
        <div className="file-manager">
            <button className="mybutton folder-button" onClick={() => onOpenPanel()}>
                <img src={folderIcon} className="w-6 h-6" />
            </button>

            <UploadFiles onUpload={onUpload} />
        </div>
    );
}