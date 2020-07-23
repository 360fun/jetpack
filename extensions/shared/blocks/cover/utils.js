/**
 * External dependencies
 */
import { values } from 'lodash';

/**
 * Internal dependencies
 */
import getAllowedMimeTypesBySite, {
	getAllowedVideoTypesByType,
	pickFileExtensionsFromMimeTypes,
} from '../../get-allowed-mime-types';

import getJetpackExtensionAvailability from '../../get-jetpack-extension-availability';
import { isSimpleSite } from '../../site-type-utils';
import { requiresPaidPlan } from '../../register-jetpack-block';

/**
 * Check if the given file is a video.
 *
 * @param   {string|object} file - file to check.
 * @returns {boolean}       True if it's a video file. Otherwise, False.
 */
export function isVideoFile( file ) {
	if ( ! file ) {
		return false;
	}

	const allowedMimeTypes = getAllowedMimeTypesBySite();
	if ( ! allowedMimeTypes ) {
		return false;
	}

	const allowedVideoMimeTypes = getAllowedVideoTypesByType( 'video' );
	const allowedVideoFileExtensions = pickFileExtensionsFromMimeTypes( allowedVideoMimeTypes );

	if ( typeof file === 'string' ) {
		const fileExtension = file.split( '.' ).pop();
		return fileExtension && allowedVideoFileExtensions.includes( fileExtension );
	}

	if ( typeof file === 'object' ) {
		return file.type && values( allowedVideoMimeTypes ).includes( file.type );
	}

	return false;
}

export function isCoverUpgradable( name ) {
	if ( name !== 'core/cover' ) {
		return false;
	}

	const { details, unavailableReason } = getJetpackExtensionAvailability( name );
	return isSimpleSite() && requiresPaidPlan( unavailableReason, details );
}
