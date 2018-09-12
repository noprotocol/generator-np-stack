<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

 /* When no .htaccess is available render dist folder via php */
// require(__DIR__."/render_dist.php");

require(__DIR__."/vendor/autoload.php");

$dotenv = new Dotenv\Dotenv(__DIR__);
if (file_exists(__DIR__.'/.env')) {
    $dotenv->load();
}

if (empty(getenv('DB_DATABASE')) && empty(getenv('DB_NAME'))) {
    trigger_error("Missing DB_DATABASE in .env", E_USER_ERROR);
}

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', getenv('DB_DATABASE') ?: getenv('DB_NAME'));

/** MySQL database username */
define('DB_USER', getenv('DB_USERNAME') ?: getenv('DB_USER'));

/** MySQL database password */
define('DB_PASSWORD', getenv('DB_PASSWORD'));

/** MySQL hostname */
if (empty(getenv('DB_PORT')) && getenv('DB_PORT') != '3306') {
    define('DB_HOST', (getenv('DB_HOST') ?: 'localhost').':'.getenv('DB_PORT'));
} else {
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
}

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', getenv('DB_COLLATE') ?: '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/}
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
if (!file_exists(__DIR__."/wp-salt.php")) {
    trigger_error("Missing wp-salt.php, run `yarn wp-salt`", E_USER_ERROR);
}
require(__DIR__."/wp-salt.php");

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';


// Changing The Site URL https://codex.wordpress.org/Changing_The_Site_URL
if (array_key_exists("APP_URL", $_SERVER)) {
    define('WP_HOME', getenv('APP_URL'));
    define('WP_SITEURL', getenv('APP_URL'));
}

define('API_LAYOUT', !empty($_GET['api']));

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
if (array_key_exists("APP_DEBUG", $_SERVER)) {
    define('WP_DEBUG', filter_var(getenv('APP_DEBUG'), FILTER_VALIDATE_BOOLEAN));
} else {
    define('WP_DEBUG', filter_var(getenv('WP_DEBUG'), FILTER_VALIDATE_BOOLEAN));
}
if (WP_DEBUG) {
    ini_set("display_errors", true);
    error_reporting(E_ALL);
}

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');