// VARIABLES & PATHS

let ftp_project_host = '',
	ftp_project_user = '',
	ftp_project_password = '',
	ftp_project_folder_path = '',

	site_proxy_name = '', // Например "modx.local" или "bootstrap4-template-gulp-sass-new" (Если верстка разрабатывается сразу на cms, то указать название домена. Если верстка отдельно - то переменная пуста)
	buildDir      = '', // Example 'assets/template/' (Build directory path WITH «/» in the end.)
	disable_templates = false,  // true, если не нужно использовать шаблоны из папки templates
	// если true, то заливаются по ftp все файлы из корневой директории (только newer) за исключением рабочих файлов, а также меняется версия js и css
	// (нужно, например, для лендинга без cms)
	// Также надо не забыть указать site_proxy_name!
	index_php_on_buildDir = false,

    fileswatch   = 'html,txt,json,md,js', // List of files extensions for watching & hard reload (comma separated, БЕЗ ПРБЕЛОВ!)
	imageswatch  = 'jpg,jpeg,png,ico,gif,svg,webp', // List of images extensions for watching & compression (comma separated, БЕЗ ПРБЕЛОВ!)
	baseDir      = 'html', // Base directory path without «/» at the end
	online       = true; // If «false» - Browsersync will work offline without internet connection

let paths = {

	scripts: {
		src: [
			baseDir + '/js/**/*.js'
		],
		build: buildDir + 'js',
		// build: __dirname + buildDir +'/js', // не работает с переменной node __dirname, поэтому без нее (__dirname почему-то работает только в переменной php_build)
	},

	styles: {
		src:  baseDir + '/scss/**/*.scss',
		dest: baseDir + '/css',
		css: baseDir + '/css/**/*',
		build: buildDir + 'css',
	},

	images: {
		src:  baseDir  + '/img/**/*.{' + imageswatch + '}',
		build: buildDir + 'img',
	},

	html: {
		html_template:  baseDir + '/template/*.html',
		html_partials: baseDir + '/template/partials/*.html',
		html_dest: baseDir,
		php_src: baseDir + '/*.php',
		php_build: __dirname,
		html_favicon_and_manifest: [baseDir  + '/favicon.ico', baseDir  + '/manifest.webmanifest'],
	},

	fonts: {
		src: [
			baseDir + '/fonts/**/*'
		],
		build: buildDir + 'fonts',
	},

	// для rsync (не используется)
	// deploy: {
	// 	hostname:    'username@yousite.com', // Deploy hostname
	// 	destination: 'yousite/public_html/', // Deploy destination
	// 	include:     [/* '*.htaccess' */], // Included files to deploy
	// 	exclude:     [ '**/Thumbs.db', '**/*.DS_Store' ], // Excluded files from deploy
	// },

	// для concat (не используется)
	// cssOutputName: 'app.min.css',
	// jsOutputName:  'app.min.js',

};

// LOGIC

const { src, dest, parallel, series, watch } = require('gulp');
const scss         = require('gulp-sass');
// const cleancss     = require('gulp-clean-css');
// const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
// const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const newer        = require('gulp-newer');
const rsync        = require('gulp-rsync');
const del          = require('del');

const rename 	    = require('gulp-rename');
const notify        = require("gulp-notify");
const fileinclude   = require('gulp-file-include');
const vinyl_ftp           = require('vinyl-ftp');
const join_media_queries = require('gulp-join-media-queries');
const gulpif = require('gulp-if');
const gulp_version = require('gulp-version-number');

// сжатие и склеивание скриптов - не используется
function scripts() {
	return src(paths.scripts.src)
		.pipe(concat(paths.jsOutputName))
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream())
}

// для файла _common.css запускать join_media_queries()
let file_is_common_css = function (file) {
	if(file.basename == '_common.css') {
		return true;
	} else{
		return false;
	}
}

// стили
function styles() {
	return src(paths.styles.src)
		.pipe(scss().on("error", notify.onError()))
		// .pipe(concat(paths.cssOutputName))
		.pipe(rename({prefix : '_'}))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		// .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
		.pipe(gulpif(file_is_common_css, join_media_queries({
			// log: true,
			use_external: true
		}) ))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSync.stream())
}

// стили складываем в корень и кешируем
function styles_to_build() {
	return src(paths.styles.css)
		// .pipe(newer(paths.styles.build))
		.pipe(newer({ dest: paths.styles.build, ext: '.css', extra:paths.styles.src }))
		.pipe(dest(paths.styles.build))
}

// очистка стилей в корне
function remove_styles_in_build() {
	return del('' + paths.styles.build + '/**/*', { force: true })
}

// скрипты складываем в корень и кешируем
function scripts_to_build() {
	return src(paths.scripts.src)
		.pipe(newer(paths.scripts.build))
		.pipe(dest(paths.scripts.build))
}

// очистка скриптов в корне
function remove_scripts_in_build() {
	return del('' + paths.scripts.build + '/**/*', { force: true })
}

// сжимаем изображения, складываем в корень, кешируем
function images_to_build() {
	return src(paths.images.src)
		.pipe(newer(paths.images.build))
		// .pipe(imagemin()) // оптимизация изображений без потери качества
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 75, progressive: true}), // сжатие jpg с потерями (как правило не заметны визуально)
			imagemin.optipng({optimizationLevel: 5}), // от 0 до 7 (почти не влияет на размер файла)
			imageminPngquant(), // сжатие png с потерями (как правило не заметны визуально)
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(dest(paths.images.build))
		.pipe(browserSync.stream())
}

// очистка изображений в корне
function remove_img_in_build() {
	return del('' + paths.images.build + '/**/*', { force: true })
}

// шрифты складываем в корень и кешируем
function fonts_to_build() {
	return src(paths.fonts.src)
		.pipe(newer(paths.fonts.build))
		.pipe(dest(paths.fonts.build))
		.pipe(browserSync.stream())
}

// очистка шрифтов в корне
function remove_fonts_in_build() {
	return del('' + paths.fonts.build + '/**/*', { force: true })
}

// сборка шаблонов из кусочков
function html(done) {
	if(!disable_templates) {
		return src(paths.html.html_template)
			.pipe(fileinclude({
				prefix: '@@',
				basepath: baseDir + '/template/partials/',
				indent: true
			}))
			.pipe(dest(paths.html.html_dest))
			.pipe(browserSync.stream());
	}
	done();
}

// удалить все файлы html из папки html
function remove_html(done) {
	if(!disable_templates) {
		return del(baseDir + '/*.html', {force: true});
	}
	done();
}

// перемещаем файлы favicon.ico и manifest.webmanifest из папки html в корень
function favicon_and_manifest(done) {
	return src(paths.html.html_favicon_and_manifest)
		.pipe(dest(paths.html.php_build))
		.pipe(browserSync.stream());
	done();
}

// подстановка версий  к _common.css, _common.js и тд
const versionConfig = {
	'value': '%MDS%',
	'append': {
		'key': 'v',
		'cover': 'custom',
		// 'to': ['css', 'js'],
		'to': [
			{
				'type'  : 'css',
				'files': ['_common.css', '_common.responsive.css', '_svhelp.css']
			},
			{
				'type'  : 'js',
				'files': ['_common.js', '_animations.js']
			}
		],
	},
};
function version(done) {
	if(index_php_on_buildDir){ // делаем это только если используется index.php
		return src(paths.html.php_src)
			.pipe(gulp_version(versionConfig))
			.pipe(dest(paths.html.php_build))
			.pipe(browserSync.stream());
	}
	done();
}

// rsync
function deploy() {
	return src(baseDir + '/')
		.pipe(rsync({
			root: baseDir + '/',
			hostname: paths.deploy.hostname,
			destination: paths.deploy.destination,
			include: paths.deploy.include,
			exclude: paths.deploy.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

// деплой на текущий проект (только новых файлов, а старые не удаляются)
function ftp(done) {

	let conn = vinyl_ftp.create({
		host:      ftp_project_host,
		user:      ftp_project_user,
		password:  ftp_project_password,
		parallel:  10,
	});

	let globs;

	// заливать по ftp ТОЛЬКО файлы из следующих папок (только newer)
	if(!index_php_on_buildDir){
		globs = [
			'css/**',
			'!css/_common.other.css', // чтоб не затереть на боевом сайте _common.other.css не закачиваем этот файл отсюда (если он нужен в dev сборке, то вручную скачиваем его с сайта и заменяем)
			'fonts/**',
			'img/**',
			'js/**',
			'favicon.ico',
			'manifest.webmanifest',
		];
	}

	// заливать по ftp все файлы из корневой директории ЗА ИСКЛЮЧЕНИЕМ СЛЕДУЮЩИХ файлов и папок (только newer)
	if(index_php_on_buildDir){
		globs = [
			'.htaccess',
			// '**/*',
			'**/**',
			'!.git/**',
			'!.idea/**',
			'!html/**',
			'!node_modules/**',
			'!.gitignore',
			'!.npmrc',
			'!gulpfile.js',
			'!package.json',
			'!*.sql',
			'!*.gz',
			'!soglasie.docx',
		];
	}

	return src( globs, { base: __dirname, buffer: false } )
		.pipe( conn.newer( ftp_project_folder_path ) ) // only upload newer files
		.pipe( conn.dest( ftp_project_folder_path ) );

	done();
}

function serve() {

	if (site_proxy_name == "") {
		browserSync.init({
			server: { baseDir: baseDir + '/' },
			notify: false,
			online: online,
			ghostMode: false,
			// open: false,
			// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
		})
	}

	// если есть proxy (например, если используется cms или php)
	if (site_proxy_name != "") {
		browserSync.init({
			proxy: site_proxy_name,
			notify: false,
			online: online,
			ghostMode: false
		})
	}

	// слежение за выполнением задач
	watch( paths.styles.src, { usePolling: true }, series(styles, styles_to_build, version ));
	watch( paths.scripts.src, { usePolling: true }, series(scripts_to_build, version ));
	// watch([baseDir + '/*.js', '!' + paths.scripts.dest + '/*.min.js'], scripts);
	watch( paths.fonts.src, { usePolling: true }, fonts_to_build);
	watch( paths.images.src, { usePolling: true }, images_to_build);
	if(!disable_templates){
		watch([ paths.html.html_template, paths.html.html_partials ], { usePolling: true }, html);
	}
	watch( paths.html.php_src, { usePolling: true }, version);
	watch( paths.html.html_favicon_and_manifest, { usePolling: true }, favicon_and_manifest);

	// слежение за обновлением файлов
	watch(
		[
			baseDir + '/**/*.{' + fileswatch + '}',
			'!' + paths.html.html_template, // исключаем файлы в template и partials
			'!' + paths.html.html_partials,
			paths.styles.css, '!' + paths.styles.dest + '/_*.css', // следим за css файлами за исключением тех css, которые генерятся из scss (они начинаются с подчеркивания _)
			paths.styles.dest + '/_common.other.css', // за кастомным "_common.other.css" тоже следим
			paths.styles.dest + '/_bootstrap.min.css', // за "_bootstrap.min.css" тоже следим, т.к. он делается вручную
			// paths.html.php_src,
		], {usePolling: true}).on('change', browserSync.reload);

}

exports.styles      = series(remove_styles_in_build, styles, styles_to_build);
exports.scripts     = series(remove_scripts_in_build, scripts_to_build);
exports.img         = images_to_build;
exports.remove_img  = remove_img_in_build;
exports.html        = series(remove_html, html);
exports.remove_html = remove_html;
exports.deploy      = deploy;
exports.ftp         = ftp;
exports.assets      = parallel(
	series(remove_html, html),
	favicon_and_manifest,
	version,
	series(remove_styles_in_build, styles, styles_to_build, version),
	series(remove_scripts_in_build, scripts_to_build, version),
	// series(remove_img_in_build, images_to_build),
	images_to_build,
	series(remove_fonts_in_build, fonts_to_build),
);
exports.default     = series(
	parallel(
		html,
		favicon_and_manifest,
		version,
		series(styles, styles_to_build, version),
		series(scripts_to_build, version),
		images_to_build,
		fonts_to_build,
	),
	serve
);