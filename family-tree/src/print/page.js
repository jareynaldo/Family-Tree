const API_URL = 'http://localhost:3500/api';

// Print page as a pdf file
document.getElementById('printButton').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ htmlContent: document.documentElement.innerHTML }),
        });

        switch (true) {
            case response.ok:
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'page.pdf';
                link.click();
                window.URL.revokeObjectURL(url);
                break;
            default:
                throw new Error('Failed to print to PDF');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
