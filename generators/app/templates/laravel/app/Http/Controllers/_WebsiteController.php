<?php

namespace App\Http\Controllers;

use App;

class WebsiteController extends Controller
{
    const EXTENSIONS = [
        'html',
        'css',
        'js',
        'svg',
        'png',
        'jpg',
        'gif',
        'woff',
        'woff2',
        'mp4',
        'mp3',
    ];
    public function index($catchall = null)
    {
        $distFolderExists = file_exists(base_path('dist'));
        if (App::environment(['local','development'])) {
            if ($catchall !== null) {
                // return $this->serveDistFolder($catchall); // TODO: This breaks history mode?
            }
        }
        if ($distFolderExists === false) {
            abort(500, "Missing dist folder, run yarn build"); // DocumentRoot should be set to the dist folder.
        }
        return file_get_contents(base_path('dist/index.html'));
    }

    private function serveDistFolder($path)
    {
        if ($path !== null && preg_match('/\.('.implode('|', self::EXTENSIONS).')(.map)?$/', $path, $match)) {
            $filename = realpath(base_path('dist/'.$path));
            if (file_exists($filename)) {
                $file = response()->file($filename);
                if ($match[1] === 'css') {
                    $file->headers->set('Content-Type', 'text/css');
                }
                return $file;
            }
        }
        abort(404);
    }
}
