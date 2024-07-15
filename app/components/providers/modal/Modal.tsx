"use client"

import Modal from 'react-modal';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    width?: string;
    height?: string;
    children: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    width,
    height,
    children
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            ariaHideApp={false}
            className={`
                    custom-modal 
                    rounded-xl
                    ${width}
                    ${height}
                `
            }
            overlayClassName="custom-overlay"
        >
            <div className="relative">
                <h2 className="text-3xl font-bold mb-4 text-gray-600 text-center">{title}</h2>
                {children}
            </div>
        </Modal>
    );
};

export default CustomModal;
