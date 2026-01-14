import sys
from pathlib import Path

try:
    import pypandoc
except ImportError:
    pypandoc = None


def convert_md_to_docx(md_path: str, docx_path: str | None = None) -> None:
    md_file = Path(md_path)
    if not md_file.exists():
        raise FileNotFoundError(f"No se encontró el archivo Markdown: {md_file}")

    if docx_path is None:
        docx_file = md_file.with_suffix('.docx')
    else:
        docx_file = Path(docx_path)

    if pypandoc is None:
        raise RuntimeError(
            "pypandoc no está instalado. Instálalo con 'pip install pypandoc' "
            "y asegúrate de tener Pandoc instalado en el sistema."
        )

    # Opciones básicas para que los encabezados se mapeen a estilos de Word
    extra_args = [
        '--standalone',
    ]

    pypandoc.convert_file(
        str(md_file),
        'docx',
        outputfile=str(docx_file),
        extra_args=extra_args,
    )

    print(f"Documento generado: {docx_file}")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python md_to_docx.py ruta/al/archivo.md [salida.docx]")
        raise SystemExit(1)

    md_input = sys.argv[1]
    docx_output = sys.argv[2] if len(sys.argv) >= 3 else None
    convert_md_to_docx(md_input, docx_output)
