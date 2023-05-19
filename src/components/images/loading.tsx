import React, {useEffect, useRef} from "react";

export const readFile = (file: File): Promise<string | ArrayBuffer | null> => {

    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(file);
    })
}

export const ImageLoader = ({ url, onChange }: { url?: string, onChange: (url: string) => void}) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [url]);

    const changeImage = (newUrl: string) => {
        imgRef.current!.src = newUrl;
        onChange(newUrl);
    }

    const readFileFromInput = () => {
        const file = inputRef.current!.files![0];
        readFile(file).then(x => changeImage(x as string))
    }

    const uploadFile = () => {
        inputRef.current?.click();
    }

    return <>
        <div onClick={uploadFile} className="image-select-wrapper cursor-pointer w-full h-full">
            <input type="file" ref={inputRef} onChange={readFileFromInput} hidden={true} accept=".jpg, .jpeg, .png"/>

            <img className="max-w-full h-full" ref={imgRef} onClick={uploadFile} src={url}/>

            <div className="absolute top-0 bottom-0 bg-gray-700/50 left-0 right-0 text-5xl flex items-center justify-center">
                <i className="fa-solid fa-upload"></i>
            </div>
        </div>
    </>
}
