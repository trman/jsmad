/*
 * NAME:    synth.init()
 * DESCRIPTION: initialize synth struct
 */
Mad.Synth = function () {
    this.filter = [];
    this.mute();
    this.phase = 0;
    
    this.pcm = {
        samplerate: 0,
        channels: 0,
        length: 0,
        samples: [
            // new Float64Array(new ArrayBuffer(8 * 1152)),
            // new Float64Array(new ArrayBuffer(8 * 1152))
            [],
            []
        ]
    };
    
    // this.pcm.clone = function() {
    //     var copy = {};
    //     copy.samplerate = this.samplerate;
    //     copy.channels = this.channels;
    //     copy.length = this.length;
    //     copy.samples = [
    //         // new Float64Array(new ArrayBuffer(8 * 1152)),
    //         // new Float64Array(new ArrayBuffer(8 * 1152))
    //         [],
    //         []
    //     ];
    //     copy.samples[0].set(this.samples[0]);
    //     copy.samples[1].set(this.samples[1]);
    //     return copy;
    // }; 
}

/*
 * NAME:    synth.mute()
 * DESCRIPTION: zero all polyphase filterbank values, resetting synthesis
 */
Mad.Synth.prototype.mute = function () {
    for (var ch = 0; ch < 2; ++ch) {
        this.filter[ch] = [ [ [], [] ], [ [], [] ] ];
        
        for (var s = 0; s < 16; ++s) {
            this.filter[ch][0][0][s] = [];
            this.filter[ch][0][1][s] = [];
            this.filter[ch][1][0][s] = [];
            this.filter[ch][1][1][s] = [];
            
            for (var v = 0; v < 8; ++v) {
                this.filter[ch][0][0][s][v] = 0;
                this.filter[ch][0][1][s][v] = 0;
                this.filter[ch][1][0][s][v] = 0;
                this.filter[ch][1][1][s][v] = 0;
            }
        }
    }
};


/*
 * NAME:    dct32()
 * DESCRIPTION: perform fast in[32].out[32] DCT
 */
Mad.Synth.dct32 = function (_in /* [32] */, slot, lo /* [16][8] */, hi /* [16][8] */) {
    var t0,   t1,   t2,   t3,   t4,   t5,   t6,   t7;
    var t8,   t9,   t10,  t11,  t12,  t13,  t14,  t15;
    var t16,  t17,  t18,  t19,  t20,  t21,  t22,  t23;
    var t24,  t25,  t26,  t27,  t28,  t29,  t30,  t31;
    var t32,  t33,  t34,  t35,  t36,  t37,  t38,  t39;
    var t40,  t41,  t42,  t43,  t44,  t45,  t46,  t47;
    var t48,  t49,  t50,  t51,  t52,  t53,  t54,  t55;
    var t56,  t57,  t58,  t59,  t60,  t61,  t62,  t63;
    var t64,  t65,  t66,  t67,  t68,  t69,  t70,  t71;
    var t72,  t73,  t74,  t75,  t76,  t77,  t78,  t79;
    var t80,  t81,  t82,  t83,  t84,  t85,  t86,  t87;
    var t88,  t89,  t90,  t91,  t92,  t93,  t94,  t95;
    var t96,  t97,  t98,  t99,  t100, t101, t102, t103;
    var t104, t105, t106, t107, t108, t109, t110, t111;
    var t112, t113, t114, t115, t116, t117, t118, t119;
    var t120, t121, t122, t123, t124, t125, t126, t127;
    var t128, t129, t130, t131, t132, t133, t134, t135;
    var t136, t137, t138, t139, t140, t141, t142, t143;
    var t144, t145, t146, t147, t148, t149, t150, t151;
    var t152, t153, t154, t155, t156, t157, t158, t159;
    var t160, t161, t162, t163, t164, t165, t166, t167;
    var t168, t169, t170, t171, t172, t173, t174, t175;
    var t176;

    /* costab[i] = cos(PI / (2 * 32) * i) */
    var costab1  =  0.998795456;
    var costab2  =  0.995184727;
    var costab3  =  0.989176510;
    var costab4  =  0.980785280;
    var costab5  =  0.970031253;
    var costab6  =  0.956940336;
    var costab7  =  0.941544065;
    var costab8  =  0.923879533;
    var costab9  =  0.903989293;
    var costab10 =  0.881921264;
    var costab11 =  0.857728610;
    var costab12 =  0.831469612;
    var costab13 =  0.803207531;
    var costab14 =  0.773010453;
    var costab15 =  0.740951125;
    var costab16 =  0.707106781;
    var costab17 =  0.671558955;
    var costab18 =  0.634393284;
    var costab19 =  0.595699304;
    var costab20 =  0.555570233;
    var costab21 =  0.514102744;
    var costab22 =  0.471396737;
    var costab23 =  0.427555093;
    var costab24 =  0.382683432;
    var costab25 =  0.336889853;
    var costab26 =  0.290284677;
    var costab27 =  0.242980180;
    var costab28 =  0.195090322;
    var costab29 =  0.146730474;
    var costab30 =  0.098017140;
    var costab31 =  0.049067674;

    // var sys = require('sys');
    // for (i = 0; i < 32; i++) {
    //     sys.print(_in[i].toFixed(8) + "\t");
    //     if (i % 8 == 7) sys.print("\n");
    // }

    t0   = _in[0]  + _in[31];  t16  = ((_in[0]  - _in[31]) * (costab1));
    t1   = _in[15] + _in[16];  t17  = ((_in[15] - _in[16]) * (costab31));

    t41  = t16 + t17;
    t59  = ((t16 - t17) * (costab2));
    t33  = t0  + t1;
    t50  = ((t0  - t1) * ( costab2));

    t2   = _in[7]  + _in[24];  t18  = ((_in[7]  - _in[24]) * (costab15));
    t3   = _in[8]  + _in[23];  t19  = ((_in[8]  - _in[23]) * (costab17));

    t42  = t18 + t19;
    t60  = ((t18 - t19) * (costab30));
    t34  = t2  + t3;
    t51  = ((t2  - t3) * ( costab30));

    t4   = _in[3]  + _in[28];  t20  = ((_in[3]  - _in[28]) * (costab7));
    t5   = _in[12] + _in[19];  t21  = ((_in[12] - _in[19]) * (costab25));

    t43  = t20 + t21;
    t61  = ((t20 - t21) * (costab14));
    t35  = t4  + t5;
    t52  = ((t4  - t5) * ( costab14));

    t6   = _in[4]  + _in[27];  t22  = ((_in[4]  - _in[27]) * (costab9));
    t7   = _in[11] + _in[20];  t23  = ((_in[11] - _in[20]) * (costab23));

    t44  = t22 + t23;
    t62  = ((t22 - t23) * (costab18));
    t36  = t6  + t7;
    t53  = ((t6  - t7) * ( costab18));

    t8   = _in[1]  + _in[30];  t24  = ((_in[1]  - _in[30]) * (costab3));
    t9   = _in[14] + _in[17];  t25  = ((_in[14] - _in[17]) * (costab29));

    t45  = t24 + t25;
    t63  = ((t24 - t25) * (costab6));
    t37  = t8  + t9;
    t54  = ((t8  - t9) * ( costab6));

    t10  = _in[6]  + _in[25];  t26  = ((_in[6]  - _in[25]) * (costab13));
    t11  = _in[9]  + _in[22];  t27  = ((_in[9]  - _in[22]) * (costab19));

    t46  = t26 + t27;
    t64  = ((t26 - t27) * (costab26));
    t38  = t10 + t11;
    t55  = ((t10 - t11) * (costab26));

    t12  = _in[2]  + _in[29];  t28  = ((_in[2]  - _in[29]) * (costab5));
    t13  = _in[13] + _in[18];  t29  = ((_in[13] - _in[18]) * (costab27));

    t47  = t28 + t29;
    t65  = ((t28 - t29) * (costab10));
    t39  = t12 + t13;
    t56  = ((t12 - t13) * (costab10));

    t14  = _in[5]  + _in[26];  t30  = ((_in[5]  - _in[26]) * (costab11));
    t15  = _in[10] + _in[21];  t31  = ((_in[10] - _in[21]) * (costab21));

    t48  = t30 + t31;
    t66  = ((t30 - t31) * (costab22));
    t40  = t14 + t15;
    t57  = ((t14 - t15) * (costab22));

    t69  = t33 + t34;  t89  = ((t33 - t34) * (costab4));
    t70  = t35 + t36;  t90  = ((t35 - t36) * (costab28));
    t71  = t37 + t38;  t91  = ((t37 - t38) * (costab12));
    t72  = t39 + t40;  t92  = ((t39 - t40) * (costab20));
    t73  = t41 + t42;  t94  = ((t41 - t42) * (costab4));
    t74  = t43 + t44;  t95  = ((t43 - t44) * (costab28));
    t75  = t45 + t46;  t96  = ((t45 - t46) * (costab12));
    t76  = t47 + t48;  t97  = ((t47 - t48) * (costab20));

    t78  = t50 + t51;  t100 = ((t50 - t51) * (costab4));
    t79  = t52 + t53;  t101 = ((t52 - t53) * (costab28));
    t80  = t54 + t55;  t102 = ((t54 - t55) * (costab12));
    t81  = t56 + t57;  t103 = ((t56 - t57) * (costab20));

    t83  = t59 + t60;  t106 = ((t59 - t60) * (costab4));
    t84  = t61 + t62;  t107 = ((t61 - t62) * (costab28));
    t85  = t63 + t64;  t108 = ((t63 - t64) * (costab12));
    t86  = t65 + t66;  t109 = ((t65 - t66) * (costab20));

    t113 = t69  + t70;
    t114 = t71  + t72;

    /*  0 */ hi[15][slot] = t113 + t114;
    /* 16 */ lo[ 0][slot] = ((t113 - t114) * (costab16));

    t115 = t73  + t74;
    t116 = t75  + t76;

    t32  = t115 + t116;

    /*  1 */ hi[14][slot] = t32;

    t118 = t78  + t79;
    t119 = t80  + t81;

    t58  = t118 + t119;

    /*  2 */ hi[13][slot] = t58;

    t121 = t83  + t84;
    t122 = t85  + t86;

    t67  = t121 + t122;

    t49  = (t67 * 2) - t32;

    /*  3 */ hi[12][slot] = t49;

    t125 = t89  + t90;
    t126 = t91  + t92;

    t93  = t125 + t126;

    /*  4 */ hi[11][slot] = t93;

    t128 = t94  + t95;
    t129 = t96  + t97;

    t98  = t128 + t129;

    t68  = (t98 * 2) - t49;

    /*  5 */ hi[10][slot] = t68;

    t132 = t100 + t101;
    t133 = t102 + t103;

    t104 = t132 + t133;

    t82  = (t104 * 2) - t58;

    /*  6 */ hi[ 9][slot] = t82;

    t136 = t106 + t107;
    t137 = t108 + t109;

    t110 = t136 + t137;

    t87  = (t110 * 2) - t67;

    t77  = (t87 * 2) - t68;

    /*  7 */ hi[ 8][slot] = t77;

    t141 = ((t69 - t70) * (costab8));
    t142 = ((t71 - t72) * (costab24));
    t143 = t141 + t142;

    /*  8 */ hi[ 7][slot] = t143;
    /* 24 */ lo[ 8][slot] =
        (((t141 - t142) * (costab16) * 2)) - t143;

    t144 = ((t73 - t74) * (costab8));
    t145 = ((t75 - t76) * (costab24));
    t146 = t144 + t145;

    t88  = (t146 * 2) - t77;

    /*  9 */ hi[ 6][slot] = t88;

    t148 = ((t78 - t79) * (costab8));
    t149 = ((t80 - t81) * (costab24));
    t150 = t148 + t149;

    t105 = (t150 * 2) - t82;

    /* 10 */ hi[ 5][slot] = t105;

    t152 = ((t83 - t84) * (costab8));
    t153 = ((t85 - t86) * (costab24));
    t154 = t152 + t153;

    t111 = (t154 * 2) - t87;

    t99  = (t111 * 2) - t88;

    /* 11 */ hi[ 4][slot] = t99;

    t157 = ((t89 - t90) * (costab8));
    t158 = ((t91 - t92) * (costab24));
    t159 = t157 + t158;

    t127 = (t159 * 2) - t93;

    /* 12 */ hi[ 3][slot] = t127;

    t160 = (((t125 - t126) * (costab16) * 2)) - t127;

    /* 20 */ lo[ 4][slot] = t160;
    /* 28 */ lo[12][slot] =
        (((((t157 - t158) * (costab16) * 2) - t159) * 2)) - t160;

    t161 = ((t94 - t95) * (costab8));
    t162 = ((t96 - t97) * (costab24));
    t163 = t161 + t162;

    t130 = (t163 * 2) - t98;

    t112 = (t130 * 2) - t99;

    /* 13 */ hi[ 2][slot] = t112;

    t164 = (((t128 - t129) * (costab16) * 2)) - t130;

    t166 = ((t100 - t101) * (costab8));
    t167 = ((t102 - t103) * (costab24));
    t168 = t166 + t167;

    t134 = (t168 * 2) - t104;

    t120 = (t134 * 2) - t105;

    /* 14 */ hi[ 1][slot] = t120;

    t135 = (((t118 - t119) * (costab16) * 2)) - t120;

    /* 18 */ lo[ 2][slot] = t135;

    t169 = (((t132 - t133) * (costab16) * 2)) - t134;

    t151 = (t169 * 2) - t135;

    /* 22 */ lo[ 6][slot] = t151;

    t170 = (((((t148 - t149) * (costab16) * 2) - t150) * 2)) - t151;

    /* 26 */ lo[10][slot] = t170;
    /* 30 */ lo[14][slot] =
        (((((((t166 - t167) * (costab16)) * 2 -
             t168) * 2) - t169) * 2) - t170);

    t171 = ((t106 - t107) * (costab8));
    t172 = ((t108 - t109) * (costab24));
    t173 = t171 + t172;

    t138 = (t173 * 2) - t110;

    t123 = (t138 * 2) - t111;

    t139 = (((t121 - t122) * (costab16) * 2)) - t123;

    t117 = (t123 * 2) - t112;

    /* 15 */ hi[ 0][slot] = t117;

    t124 = (((t115 - t116) * (costab16) * 2)) - t117;

    /* 17 */ lo[ 1][slot] = t124;

    t131 = (t139 * 2) - t124;

    /* 19 */ lo[ 3][slot] = t131;

    t140 = (t164 * 2) - t131;

    /* 21 */ lo[ 5][slot] = t140;

    t174 = (((t136 - t137) * (costab16) * 2)) - t138;

    t155 = (t174 * 2) - t139;

    t147 = (t155 * 2) - t140;

    /* 23 */ lo[ 7][slot] = t147;

    t156 = (((((t144 - t145) * (costab16) * 2) - t146) * 2)) - t147;

    /* 25 */ lo[ 9][slot] = t156;

    t175 = (((((t152 - t153) * (costab16) * 2) - t154) * 2)) - t155;

    t165 = (t175 * 2) - t156;

    /* 27 */ lo[11][slot] = t165;

    t176 = (((((((t161 - t162) * (costab16) * 2)) -
               t163) * 2) - t164) * 2) - t165;

    /* 29 */ lo[13][slot] = t176;
    /* 31 */ lo[15][slot] =
        (((((((((t171 - t172) * (costab16)) * 2 -
               t173) * 2) - t174) * 2) - t175) * 2) - t176);

    /*
     * Totals:
     *  80 multiplies
     *  80 additions
     * 119 subtractions
     *  49 shifts (not counting SSO)
     */
}

var D /* [17][32] */ = [
    /*
     * These are the coefficients for the subband synthesis window. This is a
     * reordered version of Table B.3 from ISO/IEC 11172-3.
     */
    [  0.000000000,   /*  0 */
       -0.000442505,
       0.003250122,
       -0.007003784,
       0.031082153,
       -0.078628540,
       0.100311279,
       -0.572036743,
       1.144989014,
       0.572036743,
       0.100311279,
       0.078628540,
       0.031082153,
       0.007003784,
       0.003250122,
       0.000442505,

       0.000000000,
       -0.000442505,
       0.003250122,
       -0.007003784,
       0.031082153,
       -0.078628540,
       0.100311279,
       -0.572036743,
       1.144989014,
       0.572036743,
       0.100311279,
       0.078628540,
       0.031082153,
       0.007003784,
       0.003250122,
       0.000442505 ],

    [ -0.000015259,   /*  1 */
      -0.000473022,
      0.003326416,
      -0.007919312,
      0.030517578,
      -0.084182739,
      0.090927124,
      -0.600219727,
      1.144287109,
      0.543823242,
      0.108856201,
      0.073059082,
      0.031478882,
      0.006118774,
      0.003173828,
      0.000396729,

      -0.000015259,
      -0.000473022,
      0.003326416,
      -0.007919312,
      0.030517578,
      -0.084182739,
      0.090927124,
      -0.600219727,
      1.144287109,
      0.543823242,
      0.108856201,
      0.073059082,
      0.031478882,
      0.006118774,
      0.003173828,
      0.000396729 ],

    [ -0.000015259,   /*  2 */
      -0.000534058,
      0.003387451,
      -0.008865356,
      0.029785156,
      -0.089706421,
      0.080688477,
      -0.628295898,
      1.142211914,
      0.515609741,
      0.116577148,
      0.067520142,
      0.031738281,
      0.005294800,
      0.003082275,
      0.000366211,

      -0.000015259,
      -0.000534058,
      0.003387451,
      -0.008865356,
      0.029785156,
      -0.089706421,
      0.080688477,
      -0.628295898,
      1.142211914,
      0.515609741,
      0.116577148,
      0.067520142,
      0.031738281,
      0.005294800,
      0.003082275,
      0.000366211 ],

    [ -0.000015259,   /*  3 */
      -0.000579834,
      0.003433228,
      -0.009841919,
      0.028884888,
      -0.095169067,
      0.069595337,
      -0.656219482,
      1.138763428,
      0.487472534,
      0.123474121,
      0.061996460,
      0.031845093,
      0.004486084,
      0.002990723,
      0.000320435,

      -0.000015259,
      -0.000579834,
      0.003433228,
      -0.009841919,
      0.028884888,
      -0.095169067,
      0.069595337,
      -0.656219482,
      1.138763428,
      0.487472534,
      0.123474121,
      0.061996460,
      0.031845093,
      0.004486084,
      0.002990723,
      0.000320435 ],

    [ -0.000015259,   /*  4 */
      -0.000625610,
      0.003463745,
      -0.010848999,
      0.027801514,
      -0.100540161,
      0.057617187,
      -0.683914185,
      1.133926392,
      0.459472656,
      0.129577637,
      0.056533813,
      0.031814575,
      0.003723145,
      0.002899170,
      0.000289917,

      -0.000015259,
      -0.000625610,
      0.003463745,
      -0.010848999,
      0.027801514,
      -0.100540161,
      0.057617187,
      -0.683914185,
      1.133926392,
      0.459472656,
      0.129577637,
      0.056533813,
      0.031814575,
      0.003723145,
      0.002899170,
      0.000289917 ],

    [ -0.000015259,   /*  5 */
      -0.000686646,
      0.003479004,
      -0.011886597,
      0.026535034,
      -0.105819702,
      0.044784546,
      -0.711318970,
      1.127746582,
      0.431655884,
      0.134887695,
      0.051132202,
      0.031661987,
      0.003005981,
      0.002792358,
      0.000259399,

      -0.000015259,
      -0.000686646,
      0.003479004,
      -0.011886597,
      0.026535034,
      -0.105819702,
      0.044784546,
      -0.711318970,
      1.127746582,
      0.431655884,
      0.134887695,
      0.051132202,
      0.031661987,
      0.003005981,
      0.002792358,
      0.000259399 ],

    [ -0.000015259,   /*  6 */
      -0.000747681,
      0.003479004,
      -0.012939453,
      0.025085449,
      -0.110946655,
      0.031082153,
      -0.738372803,
      1.120223999,
      0.404083252,
      0.139450073,
      0.045837402,
      0.031387329,
      0.002334595,
      0.002685547,
      0.000244141,

      -0.000015259,
      -0.000747681,
      0.003479004,
      -0.012939453,
      0.025085449,
      -0.110946655,
      0.031082153,
      -0.738372803,
      1.120223999,
      0.404083252,
      0.139450073,
      0.045837402,
      0.031387329,
      0.002334595,
      0.002685547,
      0.000244141 ],

    [ -0.000030518,   /*  7 */
      -0.000808716,
      0.003463745,
      -0.014022827,
      0.023422241,
      -0.115921021,
      0.016510010,
      -0.765029907,
      1.111373901,
      0.376800537,
      0.143264771,
      0.040634155,
      0.031005859,
      0.001693726,
      0.002578735,
      0.000213623,

      -0.000030518,
      -0.000808716,
      0.003463745,
      -0.014022827,
      0.023422241,
      -0.115921021,
      0.016510010,
      -0.765029907,
      1.111373901,
      0.376800537,
      0.143264771,
      0.040634155,
      0.031005859,
      0.001693726,
      0.002578735,
      0.000213623 ],

    [ -0.000030518,   /*  8 */
      -0.000885010,
      0.003417969,
      -0.015121460,
      0.021575928,
      -0.120697021,
      0.001068115,
      -0.791213989,
      1.101211548,
      0.349868774,
      0.146362305,
      0.035552979,
      0.030532837,
      0.001098633,
      0.002456665,
      0.000198364,

      -0.000030518,
      -0.000885010,
      0.003417969,
      -0.015121460,
      0.021575928,
      -0.120697021,
      0.001068115,
      -0.791213989,
      1.101211548,
      0.349868774,
      0.146362305,
      0.035552979,
      0.030532837,
      0.001098633,
      0.002456665,
      0.000198364 ],

    [ -0.000030518,   /*  9 */
      -0.000961304,
      0.003372192,
      -0.016235352,
      0.019531250,
      -0.125259399,
      -0.015228271,
      -0.816864014,
      1.089782715,
      0.323318481,
      0.148773193,
      0.030609131,
      0.029937744,
      0.000549316,
      0.002349854,
      0.000167847,

      -0.000030518,
      -0.000961304,
      0.003372192,
      -0.016235352,
      0.019531250,
      -0.125259399,
      -0.015228271,
      -0.816864014,
      1.089782715,
      0.323318481,
      0.148773193,
      0.030609131,
      0.029937744,
      0.000549316,
      0.002349854,
      0.000167847 ],

    [ -0.000030518,   /* 10 */
      -0.001037598,
      0.003280640,
      -0.017349243,
      0.017257690,
      -0.129562378,
      -0.032379150,
      -0.841949463,
      1.077117920,
      0.297210693,
      0.150497437,
      0.025817871,
      0.029281616,
      0.000030518,
      0.002243042,
      0.000152588,

      -0.000030518,
      -0.001037598,
      0.003280640,
      -0.017349243,
      0.017257690,
      -0.129562378,
      -0.032379150,
      -0.841949463,
      1.077117920,
      0.297210693,
      0.150497437,
      0.025817871,
      0.029281616,
      0.000030518,
      0.002243042,
      0.000152588 ],

    [ -0.000045776,   /* 11 */
      -0.001113892,
      0.003173828,
      -0.018463135,
      0.014801025,
      -0.133590698,
      -0.050354004,
      -0.866363525,
      1.063217163,
      0.271591187,
      0.151596069,
      0.021179199,
      0.028533936,
      -0.000442505,
      0.002120972,
      0.000137329,

      -0.000045776,
      -0.001113892,
      0.003173828,
      -0.018463135,
      0.014801025,
      -0.133590698,
      -0.050354004,
      -0.866363525,
      1.063217163,
      0.271591187,
      0.151596069,
      0.021179199,
      0.028533936,
      -0.000442505,
      0.002120972,
      0.000137329 ],

    [ -0.000045776,   /* 12 */
      -0.001205444,
      0.003051758,
      -0.019577026,
      0.012115479,
      -0.137298584,
      -0.069168091,
      -0.890090942,
      1.048156738,
      0.246505737,
      0.152069092,
      0.016708374,
      0.027725220,
      -0.000869751,
      0.002014160,
      0.000122070,

      -0.000045776,
      -0.001205444,
      0.003051758,
      -0.019577026,
      0.012115479,
      -0.137298584,
      -0.069168091,
      -0.890090942,
      1.048156738,
      0.246505737,
      0.152069092,
      0.016708374,
      0.027725220,
      -0.000869751,
      0.002014160,
      0.000122070 ],

    [ -0.000061035,   /* 13 */
      -0.001296997,
      0.002883911,
      -0.020690918,
      0.009231567,
      -0.140670776,
      -0.088775635,
      -0.913055420,
      1.031936646,
      0.221984863,
      0.151962280,
      0.012420654,
      0.026840210,
      -0.001266479,
      0.001907349,
      0.000106812,

      -0.000061035,
      -0.001296997,
      0.002883911,
      -0.020690918,
      0.009231567,
      -0.140670776,
      -0.088775635,
      -0.913055420,
      1.031936646,
      0.221984863,
      0.151962280,
      0.012420654,
      0.026840210,
      -0.001266479,
      0.001907349,
      0.000106812 ],

    [ -0.000061035,   /* 14 */
      -0.001388550,
      0.002700806,
      -0.021789551,
      0.006134033,
      -0.143676758,
      -0.109161377,
      -0.935195923,
      1.014617920,
      0.198059082,
      0.151306152,
      0.008316040,
      0.025909424,
      -0.001617432,
      0.001785278,
      0.000106812,

      -0.000061035,
      -0.001388550,
      0.002700806,
      -0.021789551,
      0.006134033,
      -0.143676758,
      -0.109161377,
      -0.935195923,
      1.014617920,
      0.198059082,
      0.151306152,
      0.008316040,
      0.025909424,
      -0.001617432,
      0.001785278,
      0.000106812 ],

    [ -0.000076294,   /* 15 */
      -0.001480103,
      0.002487183,
      -0.022857666,
      0.002822876,
      -0.146255493,
      -0.130310059,
      -0.956481934,
      0.996246338,
      0.174789429,
      0.150115967,
      0.004394531,
      0.024932861,
      -0.001937866,
      0.001693726,
      0.000091553,

      -0.000076294,
      -0.001480103,
      0.002487183,
      -0.022857666,
      0.002822876,
      -0.146255493,
      -0.130310059,
      -0.956481934,
      0.996246338,
      0.174789429,
      0.150115967,
      0.004394531,
      0.024932861,
      -0.001937866,
      0.001693726,
      0.000091553 ],

    [ -0.000076294,   /* 16 */
      -0.001586914,
      0.002227783,
      -0.023910522,
      -0.000686646,
      -0.148422241,
      -0.152206421,
      -0.976852417,
      0.976852417,
      0.152206421,
      0.148422241,
      0.000686646,
      0.023910522,
      -0.002227783,
      0.001586914,
      0.000076294,

      -0.000076294,
      -0.001586914,
      0.002227783,
      -0.023910522,
      -0.000686646,
      -0.148422241,
      -0.152206421,
      -0.976852417,
      0.976852417,
      0.152206421,
      0.148422241,
      0.000686646,
      0.023910522,
      -0.002227783,
      0.001586914,
      0.000076294 ]
];

/*
 * NAME:    synth.full()
 * DESCRIPTION: perform full frequency PCM synthesis
 */
Mad.Synth.prototype.full_old = function(frame, nch, ns) {
    var Dptr, hi, lo, ptr;
    
    for (var ch = 0; ch < nch; ++ch) {
        var sbsample /* [36][32] */ = frame.sbsample[ch];
        var filter = this.filter[ch]  /* [2][2][16][8] */;
        var phase    = this.phase;
        var pcm      = this.pcm.samples[ch];
        var pcm1Ptr  = 0;
        var pcm2Ptr  = 0;

        for (var s = 0; s < ns; ++s) {
            Mad.Synth.dct32(sbsample[s], phase >> 1, filter[0][phase & 1], filter[1][phase & 1]);

            var pe = phase & ~1;
            var po = ((phase - 1) & 0xf) | 1;

            /* calculate 32 samples */
            var fe = filter[0][ phase & 1];
            var fx = filter[0][~phase & 1];
            var fo = filter[1][~phase & 1];

            var fePtr = 0;
            var fxPtr = 0;
            var foPtr = 0;
            
            Dptr = 0;

            ptr = D[Dptr];
            lo =  fx[fxPtr][0] * ptr[po +  0];
            lo += fx[fxPtr][1] * ptr[po + 14];
            lo += fx[fxPtr][2] * ptr[po + 12];
            lo += fx[fxPtr][3] * ptr[po + 10];
            lo += fx[fxPtr][4] * ptr[po +  8];
            lo += fx[fxPtr][5] * ptr[po +  6];
            lo += fx[fxPtr][6] * ptr[po +  4];
            lo += fx[fxPtr][7] * ptr[po +  2];
            lo = -lo;                      
            
            lo += fe[fePtr][0] * ptr[pe +  0];
            lo += fe[fePtr][1] * ptr[pe + 14];
            lo += fe[fePtr][2] * ptr[pe + 12];
            lo += fe[fePtr][3] * ptr[pe + 10];
            lo += fe[fePtr][4] * ptr[pe +  8];
            lo += fe[fePtr][5] * ptr[pe +  6];
            lo += fe[fePtr][6] * ptr[pe +  4];
            lo += fe[fePtr][7] * ptr[pe +  2];

            pcm[pcm1Ptr++] = lo;
            pcm2Ptr = pcm1Ptr + 30;

            for (var sb = 1; sb < 16; ++sb) {
                ++fePtr;
                ++Dptr;

                /* D[32 - sb][i] == -D[sb][31 - i] */

                ptr = D[Dptr];
                lo  = fo[foPtr][0] * ptr[po +  0];
                lo += fo[foPtr][1] * ptr[po + 14];
                lo += fo[foPtr][2] * ptr[po + 12];
                lo += fo[foPtr][3] * ptr[po + 10];
                lo += fo[foPtr][4] * ptr[po +  8];
                lo += fo[foPtr][5] * ptr[po +  6];
                lo += fo[foPtr][6] * ptr[po +  4];
                lo += fo[foPtr][7] * ptr[po +  2];
                lo = -lo;

                lo += fe[fePtr][7] * ptr[pe +  2];
                lo += fe[fePtr][6] * ptr[pe +  4];
                lo += fe[fePtr][5] * ptr[pe +  6];
                lo += fe[fePtr][4] * ptr[pe +  8];
                lo += fe[fePtr][3] * ptr[pe + 10];
                lo += fe[fePtr][2] * ptr[pe + 12];
                lo += fe[fePtr][1] * ptr[pe + 14];
                lo += fe[fePtr][0] * ptr[pe +  0];

                pcm[pcm1Ptr++] = lo;

                lo =  fe[fePtr][0] * ptr[-pe + 31 - 16];
                lo += fe[fePtr][1] * ptr[-pe + 31 - 14];
                lo += fe[fePtr][2] * ptr[-pe + 31 - 12];
                lo += fe[fePtr][3] * ptr[-pe + 31 - 10];
                lo += fe[fePtr][4] * ptr[-pe + 31 -  8];
                lo += fe[fePtr][5] * ptr[-pe + 31 -  6];
                lo += fe[fePtr][6] * ptr[-pe + 31 -  4];
                lo += fe[fePtr][7] * ptr[-pe + 31 -  2];

                lo += fo[foPtr][7] * ptr[-po + 31 -  2];
                lo += fo[foPtr][6] * ptr[-po + 31 -  4];
                lo += fo[foPtr][5] * ptr[-po + 31 -  6];
                lo += fo[foPtr][4] * ptr[-po + 31 -  8];
                lo += fo[foPtr][3] * ptr[-po + 31 - 10];
                lo += fo[foPtr][2] * ptr[-po + 31 - 12];
                lo += fo[foPtr][1] * ptr[-po + 31 - 14];
                lo += fo[foPtr][0] * ptr[-po + 31 - 16];

                pcm[pcm2Ptr--] = lo;
                ++foPtr;
            }

            ++Dptr;

            ptr = D[Dptr];
            lo  = fo[foPtr][0] * ptr[po +  0];
            lo += fo[foPtr][1] * ptr[po + 14];
            lo += fo[foPtr][2] * ptr[po + 12];
            lo += fo[foPtr][3] * ptr[po + 10];
            lo += fo[foPtr][4] * ptr[po +  8];
            lo += fo[foPtr][5] * ptr[po +  6];
            lo += fo[foPtr][6] * ptr[po +  4];
            lo += fo[foPtr][7] * ptr[po +  2];

            pcm[pcm1Ptr] = -lo;
            pcm1Ptr += 16;
            phase = (phase + 1) % 16;
        }
    }
}

/*
 * NAME:    synth.full()
 * DESCRIPTION: perform full frequency PCM synthesis
 */
Mad.Synth.prototype.full = function(frame, nch, ns) {
    var Dptr, hi, lo, ptr;
    
    for (var ch = 0; ch < nch; ++ch) {
        var sbsample /* [36][32] */ = frame.sbsample[ch];
        var filter = this.filter[ch]  /* [2][2][16][8] */;
        var phase    = this.phase;
        var pcm      = this.pcm.samples[ch];
        var pcm1Ptr  = 0;
        var pcm2Ptr  = 0;

        for (var s = 0; s < ns; ++s) {
            Mad.Synth.dct32(sbsample[s], phase >> 1, filter[0][phase & 1], filter[1][phase & 1]);

            var pe = phase & ~1;
            var po = ((phase - 1) & 0xf) | 1;

            /* calculate 32 samples */
            var fe = filter[0][ phase & 1];
            var fx = filter[0][~phase & 1];
            var fo = filter[1][~phase & 1];

            var fePtr = 0;
            var fxPtr = 0;
            var foPtr = 0;
            
            Dptr = 0;

            ptr = D[Dptr];
            _fx = fx[fxPtr];
            _fe = fe[fePtr];

            lo =  _fx[0] * ptr[po +  0];
            lo += _fx[1] * ptr[po + 14];
            lo += _fx[2] * ptr[po + 12];
            lo += _fx[3] * ptr[po + 10];
            lo += _fx[4] * ptr[po +  8];
            lo += _fx[5] * ptr[po +  6];
            lo += _fx[6] * ptr[po +  4];
            lo += _fx[7] * ptr[po +  2];
            lo = -lo;                      
            
            lo += _fe[0] * ptr[pe +  0];
            lo += _fe[1] * ptr[pe + 14];
            lo += _fe[2] * ptr[pe + 12];
            lo += _fe[3] * ptr[pe + 10];
            lo += _fe[4] * ptr[pe +  8];
            lo += _fe[5] * ptr[pe +  6];
            lo += _fe[6] * ptr[pe +  4];
            lo += _fe[7] * ptr[pe +  2];

            pcm[pcm1Ptr++] = lo;
            pcm2Ptr = pcm1Ptr + 30;

            for (var sb = 1; sb < 16; ++sb) {
                ++fePtr;
                ++Dptr;

                /* D[32 - sb][i] == -D[sb][31 - i] */

                ptr = D[Dptr];
                _fo = fo[foPtr];
                _fe = fe[fePtr];

                lo  = _fo[0] * ptr[po +  0];
                lo += _fo[1] * ptr[po + 14];
                lo += _fo[2] * ptr[po + 12];
                lo += _fo[3] * ptr[po + 10];
                lo += _fo[4] * ptr[po +  8];
                lo += _fo[5] * ptr[po +  6];
                lo += _fo[6] * ptr[po +  4];
                lo += _fo[7] * ptr[po +  2];
                lo = -lo;

                lo += _fe[7] * ptr[pe + 2];
                lo += _fe[6] * ptr[pe + 4];
                lo += _fe[5] * ptr[pe + 6];
                lo += _fe[4] * ptr[pe + 8];
                lo += _fe[3] * ptr[pe + 10];
                lo += _fe[2] * ptr[pe + 12];
                lo += _fe[1] * ptr[pe + 14];
                lo += _fe[0] * ptr[pe + 0];

                pcm[pcm1Ptr++] = lo;

                lo =  _fe[0] * ptr[-pe + 31 - 16];
                lo += _fe[1] * ptr[-pe + 31 - 14];
                lo += _fe[2] * ptr[-pe + 31 - 12];
                lo += _fe[3] * ptr[-pe + 31 - 10];
                lo += _fe[4] * ptr[-pe + 31 -  8];
                lo += _fe[5] * ptr[-pe + 31 -  6];
                lo += _fe[6] * ptr[-pe + 31 -  4];
                lo += _fe[7] * ptr[-pe + 31 -  2];

                lo += _fo[7] * ptr[-po + 31 -  2];
                lo += _fo[6] * ptr[-po + 31 -  4];
                lo += _fo[5] * ptr[-po + 31 -  6];
                lo += _fo[4] * ptr[-po + 31 -  8];
                lo += _fo[3] * ptr[-po + 31 - 10];
                lo += _fo[2] * ptr[-po + 31 - 12];
                lo += _fo[1] * ptr[-po + 31 - 14];
                lo += _fo[0] * ptr[-po + 31 - 16];

                pcm[pcm2Ptr--] = lo;
                ++foPtr;
            }

            ++Dptr;

            ptr = D[Dptr];
            _fo = fo[foPtr];

            lo  = _fo[0] * ptr[po +  0];
            lo += _fo[1] * ptr[po + 14];
            lo += _fo[2] * ptr[po + 12];
            lo += _fo[3] * ptr[po + 10];
            lo += _fo[4] * ptr[po +  8];
            lo += _fo[5] * ptr[po +  6];
            lo += _fo[6] * ptr[po +  4];
            lo += _fo[7] * ptr[po +  2];

            pcm[pcm1Ptr] = -lo;
            pcm1Ptr += 16;
            phase = (phase + 1) % 16;
        }
    }
}


/*
 * NAME:    synth.half()
 * DESCRIPTION: perform half frequency PCM synthesis
 */

// Yeah, I don't think so

//static
//void synth_half(struct mad_synth *synth, struct mad_frame const *frame,
//      unsigned int nch, unsigned int ns)
//{
//  unsigned int phase, ch, s, sb, pe, po;
//  mad_fixed_t *pcm1, *pcm2, filter[2][2][16][8];
//  mad_fixed_t const (*sbsample)[36][32];
//  register mad_fixed_t (*fe)[8], (*fx)[8], (*fo)[8];
//  register mad_fixed_t const (*Dptr)[32], *ptr;
//  register mad_fixed64hi_t hi;
//  register mad_fixed64lo_t lo;
//
//  for (ch = 0; ch < nch; ++ch) {
//    sbsample = &frame.sbsample[ch];
//    filter   = &synth.filter[ch];
//    phase    = synth.phase;
//    pcm1     = synth.pcm.samples[ch];
//
//    for (s = 0; s < ns; ++s) {
//      dct32((*sbsample)[s], phase >> 1,
//      filter[0][phase & 1], filter[1][phase & 1]);
//
//      pe = phase & ~1;
//      po = ((phase - 1) & 0xf) | 1;
//
//      /* calculate 16 samples */
//
//      fe = &filter[0][ phase & 1][0];
//      fx = &filter[0][~phase & 1][0];
//      fo = &filter[1][~phase & 1][0];
//
//      Dptr = &D[0];
//
//      ptr = *Dptr + po;
//      ML0(hi, lo, (*fx)[0], ptr[ 0]);
//      MLA(hi, lo, (*fx)[1], ptr[14]);
//      MLA(hi, lo, (*fx)[2], ptr[12]);
//      MLA(hi, lo, (*fx)[3], ptr[10]);
//      MLA(hi, lo, (*fx)[4], ptr[ 8]);
//      MLA(hi, lo, (*fx)[5], ptr[ 6]);
//      MLA(hi, lo, (*fx)[6], ptr[ 4]);
//      MLA(hi, lo, (*fx)[7], ptr[ 2]);
//      MLN(hi, lo);
//
//      ptr = *Dptr + pe;
//      MLA(hi, lo, (*fe)[0], ptr[ 0]);
//      MLA(hi, lo, (*fe)[1], ptr[14]);
//      MLA(hi, lo, (*fe)[2], ptr[12]);
//      MLA(hi, lo, (*fe)[3], ptr[10]);
//      MLA(hi, lo, (*fe)[4], ptr[ 8]);
//      MLA(hi, lo, (*fe)[5], ptr[ 6]);
//      MLA(hi, lo, (*fe)[6], ptr[ 4]);
//      MLA(hi, lo, (*fe)[7], ptr[ 2]);
//
//      *pcm1++ = MLZ(hi, lo);
//
//      pcm2 = pcm1 + 14;
//
//      for (sb = 1; sb < 16; ++sb) {
//  ++fe;
//  ++Dptr;
//
//  /* D[32 - sb][i] == -D[sb][31 - i] */
//
//  if (!(sb & 1)) {
//    ptr = *Dptr + po;
//    ML0(hi, lo, (*fo)[0], ptr[ 0]);
//    MLA(hi, lo, (*fo)[1], ptr[14]);
//    MLA(hi, lo, (*fo)[2], ptr[12]);
//    MLA(hi, lo, (*fo)[3], ptr[10]);
//    MLA(hi, lo, (*fo)[4], ptr[ 8]);
//    MLA(hi, lo, (*fo)[5], ptr[ 6]);
//    MLA(hi, lo, (*fo)[6], ptr[ 4]);
//    MLA(hi, lo, (*fo)[7], ptr[ 2]);
//    MLN(hi, lo);
//
//    ptr = *Dptr + pe;
//    MLA(hi, lo, (*fe)[7], ptr[ 2]);
//    MLA(hi, lo, (*fe)[6], ptr[ 4]);
//    MLA(hi, lo, (*fe)[5], ptr[ 6]);
//    MLA(hi, lo, (*fe)[4], ptr[ 8]);
//    MLA(hi, lo, (*fe)[3], ptr[10]);
//    MLA(hi, lo, (*fe)[2], ptr[12]);
//    MLA(hi, lo, (*fe)[1], ptr[14]);
//    MLA(hi, lo, (*fe)[0], ptr[ 0]);
//
//    *pcm1++ = MLZ(hi, lo);
//
//    ptr = *Dptr - po;
//    ML0(hi, lo, (*fo)[7], ptr[31 -  2]);
//    MLA(hi, lo, (*fo)[6], ptr[31 -  4]);
//    MLA(hi, lo, (*fo)[5], ptr[31 -  6]);
//    MLA(hi, lo, (*fo)[4], ptr[31 -  8]);
//    MLA(hi, lo, (*fo)[3], ptr[31 - 10]);
//    MLA(hi, lo, (*fo)[2], ptr[31 - 12]);
//    MLA(hi, lo, (*fo)[1], ptr[31 - 14]);
//    MLA(hi, lo, (*fo)[0], ptr[31 - 16]);
//
//    ptr = *Dptr - pe;
//    MLA(hi, lo, (*fe)[0], ptr[31 - 16]);
//    MLA(hi, lo, (*fe)[1], ptr[31 - 14]);
//    MLA(hi, lo, (*fe)[2], ptr[31 - 12]);
//    MLA(hi, lo, (*fe)[3], ptr[31 - 10]);
//    MLA(hi, lo, (*fe)[4], ptr[31 -  8]);
//    MLA(hi, lo, (*fe)[5], ptr[31 -  6]);
//    MLA(hi, lo, (*fe)[6], ptr[31 -  4]);
//    MLA(hi, lo, (*fe)[7], ptr[31 -  2]);
//
//    *pcm2-- = MLZ(hi, lo);
//  }
//
//  ++fo;
//      }
//
//      ++Dptr;
//
//      ptr = *Dptr + po;
//      ML0(hi, lo, (*fo)[0], ptr[ 0]);
//      MLA(hi, lo, (*fo)[1], ptr[14]);
//      MLA(hi, lo, (*fo)[2], ptr[12]);
//      MLA(hi, lo, (*fo)[3], ptr[10]);
//      MLA(hi, lo, (*fo)[4], ptr[ 8]);
//      MLA(hi, lo, (*fo)[5], ptr[ 6]);
//      MLA(hi, lo, (*fo)[6], ptr[ 4]);
//      MLA(hi, lo, (*fo)[7], ptr[ 2]);
//
//      *pcm1 = -MLZ(hi, lo);
//      pcm1 += 8;
//
//      phase = (phase + 1) % 16;
//    }
//  }
//}

/*
 * NAME:    synth.frame()
 * DESCRIPTION: perform PCM synthesis of frame subband samples
 */
Mad.Synth.prototype.frame = function (frame) {
    var nch = frame.header.nchannels();
    var ns  = frame.header.nbsamples();

    this.pcm.samplerate = frame.header.samplerate;
    this.pcm.channels   = nch;
    this.pcm.length     = 32 * ns;

    // console.log("ns: " + ns);

    /*
     if (frame.options & Mad.Option.HALFSAMPLERATE) {
     this.pcm.samplerate /= 2;
     this.pcm.length     /= 2;

     throw new Error("HALFSAMPLERATE is not supported. What do you think? As if I have the time for this");
     }
     */

    this.full(frame, nch, ns);
    this.phase = (this.phase + ns) % 16;
}
