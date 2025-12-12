import uploadIcon from "../../assets/svg_upload_icon.svg";

export default function UploadFiles({ onUpload }: { onUpload: (file: File) => void }) {
    return (
        <div>
            <label htmlFor="file" className="mybutton upload-btn">
            <img src={uploadIcon} className="w-6 h-6" />
            </label>
            <input 
                id="file"
                type="file"
                className="hidden-input" 
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        onUpload(e.target.files[0]);
                    }
                }}
                />
        </div>
    );
}