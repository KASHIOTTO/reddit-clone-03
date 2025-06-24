import React from "react";

export function parseHyperLinks(text){
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    while((match = regex.exec(text)) !== null){
        const matchText = match[0];
        const linkText = match[1];
        const linkUrl = match[2];
        const startIndex = match.index;
        if(startIndex > lastIndex){
            elements.push(text.substring(lastIndex, startIndex));
        }
        elements.push(<a key={startIndex} href={linkUrl} target="_blank" rel="noopener noreferrer">{linkText}</a>);
        lastIndex = startIndex + matchText.length;
    }
    if(lastIndex < text.length){
        elements.push(text.substring(lastIndex));
    }
    return elements;
}