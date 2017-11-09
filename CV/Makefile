all: CV.html CV.pdf CV.docx CV.txt

CV.html: CV.md style.css
	pandoc --standalone -c style.css --from markdown --to html -o CV.html CV.md

CV.pdf: CV.html
	wkhtmltopdf CV.html CV.pdf

CV.docx: CV.md
	pandoc --from markdown --to docx -o CV.docx CV.md

CV.txt: CV.md
	pandoc --standalone --smart --from markdown --to plain -o CV.txt CV.md

clean:
	rm -f *.html *.pdf *.docx *.txt
