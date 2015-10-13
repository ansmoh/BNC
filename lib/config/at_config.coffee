
onSubmitHook = (err, state) ->
  unless err
    if state == 'signIn' or state == 'signUp'
      Router.go('trade')

onLogoutHook = () ->
  Router.go('home')

preSignUpHook = (password, info) ->

AccountsTemplates.configure
  # Behavior
  confirmPassword: true
  defaultState: "signIn"
  enablePasswordChange: true
  enforceEmailVerification: true
  focusFirstInput: true
  forbidClientAccountCreation: false
  overrideLoginErrors: false
  sendVerificationEmail: true
  redirectTimeout: 2000
  socialLoginStyle: 'popup'
  lowercaseUsername: false
  # Appearance
  hideSignInLink: false
  hideSignUpLink: false
  showAddRemoveServices: false
  showForgotPasswordLink: true
  showLabels: false
  showPlaceholders: true
  showResendVerificationEmailLink: true
  # Client-side Validation
  continuousValidation: false
  negativeValidation: true
  positiveValidation: true
  negativeFeedback: false
  positiveFeedback: true
  showValidating: true
  # Links
  homeRoutePath: '/'
  privacyUrl: '//buyanycoin.com/privacy'
  termsUrl: '//buyanycoin.com/terms-and-conditions'
  # Hooks
  onLogoutHook: onLogoutHook
  onSubmitHook: onSubmitHook
  preSignUpHook: preSignUpHook
  # Texts
  texts:
    navSignIn: "signIn"
    navSignOut: "signOut"
    optionalField: "optional"
    pwdLink_pre: ""
    pwdLink_link: "forgotPassword"
    pwdLink_suff: ""
    resendVerificationEmailLink_pre: "Verification email lost?"
    resendVerificationEmailLink_link: "Send again"
    resendVerificationEmailLink_suff: ""
    sep: "OR"
    signInLink_pre: "ifYouAlreadyHaveAnAccount"
    signInLink_link: "signin"
    signInLink_suff: ""
    signUpLink_pre: "dontHaveAnAccount"
    signUpLink_link: "signUp"
    signUpLink_suff: ""
    termsPreamble: "clickAgree"
    termsPrivacy: "privacyPolicy"
    termsAnd: "and"
    termsTerms: "terms"
    title:
      changePwd: "Password Title"
      enrollAccount: "Join today"
      forgotPwd: "Reset Password"
      resetPwd: "Password Recovery"
      signIn: "Sign in below"
      signUp: "Create your account"
      verifyEmail: "Email Verification"
    button:
      changePwd: "Change Password"
      enrollAccount: "Join now"
      forgotPwd: "Send Reset Instructions"
      resetPwd: "Change Password"
      signIn: "Log In"
      signUp: "Sign Up"
    info:
      emailSent: "info.emailSent"
      emailVerified: "info.emailVerified"
      pwdChanged: "info.passwordChanged"
      pwdReset: "info.passwordReset"
      pwdSet: "info.passwordReset"
      signUpVerifyEmail: "Successful Registration! Please check your email and follow the instructions."
      verificationEmailSent: "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder."
    inputIcons:
      isValidating: "fa fa-spinner fa-spin"
      hasSuccess: "fa fa-check"
      hasError: "fa fa-times"
