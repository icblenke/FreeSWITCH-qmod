/*
 * Copyright (c) 2009 Konrad Hammel <konrad@sangoma.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms|with or without
 * modification|are permitted provided that the following conditions
 * are met:
 *
 * * Redistributions of source code must retain the above copyright
 * notice|this list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright
 * notice|this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * * Neither the name of the original author; nor the names of any contributors
 * may be used to endorse or promote products derived from this software
 * without specific prior written permission.
 *
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES|INCLUDING|BUT NOT
 * LIMITED TO|THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT|INDIRECT|INCIDENTAL|SPECIAL,
 * EXEMPLARY|OR CONSEQUENTIAL DAMAGES (INCLUDING|BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE|DATA|OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY|WHETHER IN CONTRACT|STRICT LIABILITY|OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE|EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* INCLUDE ********************************************************************/
#include "ftmod_sangoma_ss7_main.h"
/******************************************************************************/

/* DEFINES ********************************************************************/
/******************************************************************************/

/* GLOBALS ********************************************************************/
/******************************************************************************/

/* PROTOTYPES *****************************************************************/
int ftmod_ss7_mtplink_sta(uint32_t id, SnMngmt *cfm);
int ftmod_ss7_mtplinkSet_sta(uint32_t id, SnMngmt *cfm);
/******************************************************************************/

/* FUNCTIONS ******************************************************************/
int ftmod_ss7_mtplink_sta(uint32_t id, SnMngmt *cfm)
{
	SnMngmt	sta;
	Pst		pst;

	memset(&sta, 0x0, sizeof(sta));

	/* initalize the post structure */
	smPstInit(&pst);

	/* insert the destination Entity */
	pst.dstEnt = ENTSN;

	sta.hdr.elmId.elmnt 		= STDLSAP;
	sta.hdr.elmId.elmntInst1	= g_ftdm_sngss7_data.cfg.mtpLink[id].id;

	return(sng_sta_mtp3(&pst, &sta, cfm));
}

/******************************************************************************/
int ftmod_ss7_mtplinkSet_sta(uint32_t id, SnMngmt *cfm)
{
	SnMngmt	sta;
	Pst		pst;

	memset(&sta, 0x0, sizeof(sta));

	/* initalize the post structure */
	smPstInit(&pst);

	/* insert the destination Entity */
	pst.dstEnt = ENTSN;

	sta.hdr.elmId.elmnt 		= STLNKSET;
	sta.hdr.elmId.elmntInst1	= g_ftdm_sngss7_data.cfg.mtpLinkSet[id].id;
	sta.hdr.elmId.elmntInst2	= g_ftdm_sngss7_data.cfg.mtpLinkSet[id].links[0];

	return(sng_sta_mtp3(&pst, &sta, cfm));
}
/******************************************************************************/

/******************************************************************************/
/* For Emacs:
 * Local Variables:
 * mode:c
 * indent-tabs-mode:t
 * tab-width:4
 * c-basic-offset:4
 * End:
 * For VIM:
 * vim:set softtabstop=4 shiftwidth=4 tabstop=4:
 */
/******************************************************************************/